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

class ProjectEasifyUserController extends Controller
{
  function fetchProjectByEasifyUser(Request $request) {
    $validate =  Validator::make($request->all(), [
      'easify_user_id' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    // $project_class = Project::class;
    $project_easify_user_class = ProjectEasifyUser::class;

    if($project_easify_user_class::firstWhere(['easify_user_id' => $request->easify_user_id])) {

      $projects_by_easify_user = EasifyUser::find($request->easify_user_id)->project;
      $project_data = [];

      for($i=0 ; $i<count($projects_by_easify_user) ; $i++) {
        $temp_my_role = $project_easify_user_class::
        where('project_id', $projects_by_easify_user[$i]['id'])
        ->where('easify_user_id', $request->easify_user_id)
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
        'success' => "Project details successfuly fethed by user",
      ], 200);
    } else {
      return Response::json([
        'data' => [],
        'status' => 200,
        'success' => "Project easify User details not found",
        'error' => "Project easify User details not found",
      ], 200);
    }
  }
}
