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

class TaskController extends Controller
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
      return Response::json([
        'data' => [
          'backlog_item_data' => Task::where('project_id', $request->project_id)->get(), 
          'last_unique_key_number' => Task::where('project_id', $request->project_id)->max('unique_key_number'), 
        ],
        'status' => 200,
        'success' => "Task successfully fetched.", 
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
      'name' => ['required'],
      'unique_key_number' => ['required'],
      'priority' => ['required'],
      'type' => ['required'],
      'progress' => ['required'],
      'project_id' => ['required'],
      'sprint_id' => ['required'],
      'created_by' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    $check_already_exists = Task::where('project_id', $request->project_id)
    ->where('unique_key_number', $request->unique_key_number)
    ->get();
    if(count($check_already_exists) == 0) {
      if(Project::firstWhere(['id' => $request->project_id])) {
        if(EasifyUser::firstWhere(['id' => $request->created_by])) {
          if(Sprint::firstWhere(['id' => $request->sprint_id]) || $request->sprint_id == '-') {
            $new_backlog_item_details = [
              'name' => $request->name,
              'unique_key_number' => $request->unique_key_number,
              'priority' => $request->priority,
              'type' => $request->type,
              'progress' => $request->progress,
              'project_id' => $request->project_id,
              'sprint_id' => $request->sprint_id,
              'created_by' => $request->created_by,
            ];

            Task::create($new_backlog_item_details);

            return Response::json([
              'data' => [
                'backlog_item_data' => Task::where('project_id', $request->project_id)->get(), 
                'last_unique_key_number' => Task::where('project_id', $request->project_id)->max('unique_key_number'), 
              ],
              'status' => 200,
              'success' => "Task successfully added.", 
            ], 200);
          } else {
            return Response::json([
              'data' => [],
              'status' => 201,
              'error' => "Sprint details not found.", 
              'print_error' => "Sprint details not found.", 
            ], 200);
          }
        } else {
          return Response::json([
            'data' => [],
            'status' => 201,
            'error' => "Easify User details not found.", 
            'print_error' => "Easify User details not found.", 
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
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Task unique key already exists.", 
        'print_error' => "Task unique key already exists.", 
      ], 200);
    }
  }

  function update(Request $request) {
    $validate =  Validator::make($request->all(), [
      'id' => ['required'],
      'name' => ['required'],
      'unique_key_number' => ['required'],
      'priority' => ['required'],
      'type' => ['required'],
      'progress' => ['required'],
      'project_id' => ['required'],
      'sprint_id' => ['required'],
      'created_by' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    $tag_sprint_id = true;
    if($request->sprint_id != '-') {
      $sprint_id = Sprint::where('project_id', $request->project_id)
      ->where('unique_key_number', $request->sprint_id)
      ->get();
      if(count($sprint_id) == 0) {
        $tag_sprint_id = false;
      }
    }

    if(Task::firstWhere(['id' => $request->id])) {
      if(Project::firstWhere(['id' => $request->project_id])) {
        if(EasifyUser::firstWhere(['id' => $request->created_by])) {
          if($tag_sprint_id) {
            $update_backlog_item_details = [
              'name' => $request->name,
              'unique_key_number' => $request->unique_key_number,
              'priority' => $request->priority,
              'type' => $request->type,
              'progress' => $request->progress,
              'project_id' => $request->project_id,
              'sprint_id' => $request->sprint_id,
              'created_by' => $request->created_by,
            ];

            Task::where('id', $request->id)->update($update_backlog_item_details);

            return Response::json([
              'data' => [
                'backlog_item_data' => Task::where('project_id', $request->project_id)->get(), 
                'last_unique_key_number' => Task::where('project_id', $request->project_id)->max('unique_key_number'), 
              ],
              'status' => 200,
              'success' => "Task details successfully updated.", 
            ], 200);
          } else {
            return Response::json([
              'data' => [],
              'status' => 201,
              'error' => "Sprint details not found.", 
              'print_error' => "Sprint details not found.", 
            ], 200);
          }
        } else {
          return Response::json([
            'data' => [],
            'status' => 201,
            'error' => "Easify User details not found.", 
            'print_error' => "Easify User details not found.", 
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
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Task details not found.", 
        'print_error' => "Task details not found.", 
      ], 200);
    }
  }

  function delete(Request $request) {
    $validate =  Validator::make($request->all(), [
      'id' => ['required'],
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

    if(Task::firstWhere(['id' => $request->id])) {
      if(Project::firstWhere(['id' => $request->project_id])) {
        Task::where('id', $request->id)
        ->where('project_id', $request->project_id)
        ->where('unique_key_number', $request->unique_key_number)
        ->delete();

        return Response::json([
          'data' => [],
          'status' => 200,
          'success' => "Task details successfully deleted.", 
        ], 200);
      } else {
        return Response::json([
          'data' => [],
          'status' => 201,
          'error' => "Project details not found.", 
          'print_error' => "Project details not found.", 
        ], 200);
      }
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Task details not found.", 
        'print_error' => "Task details not found.", 
      ], 200);
    }
  }
}
