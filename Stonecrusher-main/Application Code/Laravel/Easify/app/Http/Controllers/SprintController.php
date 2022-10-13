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
use App\Models\Task;
use App\Models\Sprint;

class SprintController extends Controller
{
  function fetch(Request $request) {
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

    if(Project::firstWhere(['id' => $request->project_id])) {
      $sprint_data = Sprint::where('project_id', $request->project_id)->get();
      $array_sprint_backlog_item_data = [];
      for($i=0 ; $i<count($sprint_data) ; $i++) {
        $sprint_backlog_item_data = Task::where('project_id', $request->project_id)
        ->where('sprint_id', $sprint_data[$i]["unique_key_number"])
        ->get();

        array_push($array_sprint_backlog_item_data, $sprint_backlog_item_data);
      }

      return Response::json([
        'data' => [
          'sprint_data' => Sprint::where('project_id', $request->project_id)->get(), 
          'last_unique_key_number' => Sprint::where('project_id', $request->project_id)->max('unique_key_number') 
          == null ? 1 : Sprint::where('project_id', $request->project_id)->max('unique_key_number') + 1, 
          'sprint_backlog_item_data' => $array_sprint_backlog_item_data, 
        ],
        'status' => 200,
        'success' => "Sprint details successfully fetched.", 
      ], 200);
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Project details not found.", 
        'print_error' => "Project details not found.", 
      ], 200);
    }
  }

  function add(Request $request) {
    $validate =  Validator::make($request->all(), [
      // 'name' => ['required'],
      'unique_key_number' => ['required'],
      'duration' => ['required'],
      'project_id' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    if(Project::firstWhere(['id' => $request->project_id])) {

      $check_unique_key_number = Sprint::where('project_id', $request->project_id)
      ->where('unique_key_number', $request->unique_key_number)
      ->get();

      if(count($check_unique_key_number) == 0) {
        $new_sprint_details = [
          'name' => $request->name, 
          'unique_key_number' => $request->unique_key_number,
          'duration' => $request->duration,
          'project_id' => $request->project_id,
        ];

        Sprint::create($new_sprint_details);

        $sprint_data = Sprint::where('project_id', $request->project_id)->get();
        $array_sprint_backlog_item_data = [];
        for($i=0 ; $i<count($sprint_data) ; $i++) {
          $sprint_backlog_item_data = Task::where('project_id', $request->project_id)
          ->where('sprint_id', $sprint_data[$i]["unique_key_number"])
          ->get();

          array_push($array_sprint_backlog_item_data, $sprint_backlog_item_data);
        }

        return Response::json([
          'data' => [
            'sprint_data' => Sprint::where('project_id', $request->project_id)->get(), 
            'last_unique_key_number' => Sprint::where('project_id', $request->project_id)->max('unique_key_number') 
              == null ? 1 : Sprint::where('project_id', $request->project_id)->max('unique_key_number') + 1, 
            'sprint_backlog_item_data' => $array_sprint_backlog_item_data, 
          ],
          'status' => 200,
          'success' => "Sprint details successfully fetched.", 
        ], 200);
      } else {
        return Response::json([
          'data' => [],
          'status' => 201,
          'error' => "Unique key number already exists.", 
          'print_error' => "Unique key number already exists.", 
        ], 200);
      }
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Project details not found.", 
        'print_error' => "Project details not found.", 
      ], 200);
    }
  }

  function delete(Request $request) {
    $validate =  Validator::make($request->all(), [
      'unique_key_number' => ['required'],
      'project_id' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    if(Project::firstWhere(['id' => $request->project_id])) {
      $sprint_data = Task::where('project_id', $request->project_id)
      ->where('sprint_id', $request->unique_key_number)
      ->update([
        'sprint_id' => '-', 
        'progress' => '-', 
      ]);

      Sprint::where('project_id', $request->project_id)
      ->where('unique_key_number', $request->unique_key_number)
      ->delete();

      return Response::json([
        'data' => [],
        'status' => 200,
        'success' => "Sprint details successfully deleted.", 
      ], 200);
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Project details not found.", 
        'print_error' => "Project details not found.", 
      ], 200);
    }
  }
}
