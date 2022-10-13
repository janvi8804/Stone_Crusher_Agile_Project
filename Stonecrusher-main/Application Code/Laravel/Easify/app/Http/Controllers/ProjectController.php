<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use App\Models\EasifyUser;
use App\Models\Project;
use App\Models\ProjectEasifyUser;

class ProjectController extends Controller
{
  function addProject(Request $request) {
    $validate =  Validator::make($request->all(), [
      'title' => ['required'],
      'owner_id' => ['required'],
      'role' => ['required'],
      'image_url' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    $project_class = Project::class;
    $project_exist_or_not = $project_class::
    where('title', $request->title)
    ->where('owner_id', $request->owner_id)
    ->get();

    if(strlen($request->title) > 3) {
      $unique_key_name = $request->title[0].$request->title[1].$request->title[2];
    } else {
      $unique_key_name = $request->title[0];
    }

    if(count($project_exist_or_not) == 0) {
      $new_project_details = [
        'title' => $request->title,
        'owner_id' => $request->owner_id,
        'image_url' => $request->image_url, 
        'unique_key_name' => $unique_key_name,
      ];

      Project::create($new_project_details);

      $new_created_project = $project_class::
      where('title', $request->title)
      ->where('owner_id', $request->owner_id)
      ->first();

      $new_project_easify_user_details = [
        'project_id' => $new_created_project['id'], 
        'easify_user_id' => $request->owner_id, 
        'role' => $request->role, 
      ];

      ProjectEasifyUser::create($new_project_easify_user_details);

      $project_easify_user_class = ProjectEasifyUser::class;

      if($project_easify_user_class::firstWhere(['easify_user_id' => $request->owner_id])) {

        $projects_by_easify_user = EasifyUser::find($request->owner_id)->project;
        $project_data = [];

        for($i=0 ; $i<count($projects_by_easify_user) ; $i++) {
          $temp_my_role = $project_easify_user_class::
          where('project_id', $projects_by_easify_user[$i]['id'])
          ->where('easify_user_id', $request->owner_id)
          ->first();
          
          $temp_project_shared = [];
          $project_shared_users = Project::find($projects_by_easify_user[$i]['id'])->easify_user;

          for($j=0 ; $j<count($project_shared_users) ; $j++) {
            $temp_user_role = $project_easify_user_class::
            where('project_id', $projects_by_easify_user[$i]['id'])
            ->where('easify_user_id', $project_shared_users[$j]['id'])
            ->first();

            array_push($temp_project_shared, [
              'user_id' => $project_shared_users[$j]['id'], 
              'user_name' => $project_shared_users[$j]['name'],
              'user_email' => $project_shared_users[$j]['email'],
              'user_image_url' => $project_shared_users[$j]['image_url'],
              'user_role' => $temp_user_role['role'], 
            ]);
          }

          array_push($project_data, [
            'project_id' => $projects_by_easify_user[$i]['id'],
            'project_title' => $projects_by_easify_user[$i]['title'],
            'project_image_url' => $projects_by_easify_user[$i]['image_url'],
            'project_owner_id' => $projects_by_easify_user[$i]['owner_id'],
            'project_unique_key_name' => $projects_by_easify_user[$i]['unique_key_name'],
            'project_owner_name' => EasifyUser::find($projects_by_easify_user[$i]['owner_id'])['name'],
            'project_owner_email' => EasifyUser::find($projects_by_easify_user[$i]['owner_id'])['email'],
            'project_owner_image_url' => EasifyUser::find($projects_by_easify_user[$i]['owner_id'])['image_url'],
            'project_my_role' => $temp_my_role['role'],
            'project_shared' => $temp_project_shared,
          ]);
        }

        return Response::json([
          'data' => $project_data,
          'status' => 200,
          'success' => "Project details successfuly added",
        ], 200);
      }
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Project Name must be unique.", 
        'print_error' => "Project with this name already exists.", 
      ], 200);
    }
  }

  function shareProject(Request $request) {
    $validate =  Validator::make($request->all(), [
      'project_id' => ['required'],
      'easify_user_id' => ['required'],
      'role' => ['required'],
      'owner_id' => ['required'], 
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    $project_class = Project::class;
    $easify_user_class = EasifyUser::class;

    $easfiy_user_id = json_decode($request->easify_user_id);
    $role = json_decode($request->role);
    
    $check = 0;
    if($project_class::firstWhere(['id' => $request->project_id])) {
      $array_easify_user_present = [];
      $array_easify_user_not_available = [];
      $array_role = [];
      for($i=0 ; $i<count($easfiy_user_id) ; $i++) {
        if($easify_user_class::firstWhere(['id' => $easfiy_user_id[$i]])) {
          array_push($array_easify_user_present, $easfiy_user_id[$i]);
          array_push($array_role, $role[$i]);
        } else {
          $check++;
          array_push($array_easify_user_not_available, $easfiy_user_id[$i]);
        }
      }

      $project_share_details = ProjectEasifyUser::where('project_id', $request->project_id)->get();

      for($i=0 ; $i<count($project_share_details) ; $i++) {
        if($project_share_details[$i]['easify_user_id'] != $request->owner_id) {
          $project_easify_user_present = ProjectEasifyUser::
            where('project_id', $request->project_id)
            ->where('id', $project_share_details[$i]['id'])
            ->get();
          
          if(count($project_easify_user_present) > 0) {
            ProjectEasifyUser::
              where('project_id', $request->project_id)
              ->where('id', $project_share_details[$i]['id'])
              ->delete();
          }
        }
      }

      $new_data = 0;
      $update_data = 0;
      for($i=0 ; $i<count($array_easify_user_present) ; $i++) {
        $project_easify_user_present = ProjectEasifyUser::
          where('project_id', $request->project_id)
          ->where('easify_user_id', $array_easify_user_present[$i])
          ->get();

        $new_entry_project_easify_user_data = [
          'project_id' => $request->project_id, 
          'easify_user_id' => $array_easify_user_present[$i], 
          'role' => $array_role[$i]
        ];

        if(count($project_easify_user_present) == 0) {
          // create
          $new_data++;
          ProjectEasifyUser::create($new_entry_project_easify_user_data);
        } else {
          // update
          $update_data++;
          ProjectEasifyUser::
            where('project_id', $request->project_id)
            ->where('easify_user_id', $array_easify_user_present[$i])
            ->update($new_entry_project_easify_user_data);
        }
      }

      if($check == 0) {
        return Response::json([
          'data' => [],
          'status' => 200,
          'success' => $new_data."Project Easify User details add successfully".
                        $update_data."Project Easify User details update successfully",
        ], 200);
      } else {
        return Response::json([
          'data' => [
            'success' => $array_easify_user_present, 
            'error' => $array_easify_user_not_available,
          ],
          'status' => 201,
          'success' => $new_data."Project Easify User details add successfully".
                        $update_data."Project Easify User details update successfully",
          'error' => "Some of the Easify User details not found",
          'print_error' => $check.' Users details not found',
        ], 200);
      }
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Project details not found",
        'print_error' => "Project details not found",
      ], 200);
    }
  }

  function fetchSharedEasifyUserByProject(Request $request) {
    $validate =  Validator::make($request->all(), [
      'project_id' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    $project_class = Project::class;
    // $project_easify_user_details = ProjectEasifyUser::where('id', $request->project_id)->get();
    // echo Project::find($request->project_id)->easify_user;

    if($project_class::firstWhere(['id' => $request->project_id])) {
      $shared_easify_user_details = Project::find($request->project_id)->easify_user;
      $shared_data = [];
      for($i=0 ; $i<count($shared_easify_user_details) ; $i++) {
        $role = ProjectEasifyUser::
          where('project_id', $request->project_id)
          ->where('easify_user_id', $shared_easify_user_details[$i]['id'])
          ->first();

        array_push($shared_data, [
          'user_id' => $shared_easify_user_details[$i]['id'], 
          'user_name' => $shared_easify_user_details[$i]['name'],
          'user_email' => $shared_easify_user_details[$i]['email'],
          'user_image_url' => $shared_easify_user_details[$i]['image_url'],
          'user_role' => $role['role'], 
        ]);
      }

      return Response::json([
        'data' => $shared_data,
        'status' => 200,
        'success' => "Project Shared User Details successfuly fetched.", 
      ], 200);
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Project does not exists.", 
        'print_error' => "Project does not exists.", 
      ], 200);
    }
  }
}
