<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\EasifyUserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectEasifyUserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\SprintBacklogItemController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/login',[EasifyUserController::class,'login']);
Route::get('/register',[EasifyUserController::class,'register']);

Route::prefix('EasifyUser')->group(function() {
  // Route::get('/profile',[AdminController::class,'profile']);
  // Route::post('/profile',[AdminController::class,'profile']);
  Route::get('/fetchAllUser',[EasifyUserController::class,'fetchAllUser']);
  // Route::get('/addNewUser',[AdminController::class,'addNewUser']);
  // Route::get('/updateUser',[AdminController::class,'updateUser']);
  // Route::get('/deleteUserArray',[AdminController::class,'deleteUserArray']);
});

Route::prefix('Project')->group(function() {
  Route::post('/addProject',[ProjectController::class,'addProject']);
  Route::get('/shareProject',[ProjectController::class,'shareProject']);
  Route::get('/fetchSharedEasifyUserByProject',[ProjectController::class,'fetchSharedEasifyUserByProject']);
  Route::get('/fetchProjectByEasifyUser',[ProjectEasifyUserController::class,'fetchProjectByEasifyUser']);
  Route::get('/addTask',[ProjectEasifyUserController::class,'addTask']);
  Route::get('/fetchTasksByProject',[ProjectEasifyUserController::class,'fetchTasksByProject']);
});

Route::prefix('task')->group(function() {
  Route::get('/add',[TaskController::class,'add']);
  Route::get('/update',[TaskController::class,'update']);
  Route::get('/fetch',[TaskController::class,'fetch']);
  Route::get('/delete',[TaskController::class,'delete']);
});

Route::prefix('sprint')->group(function() {
  Route::get('/add',[SprintController::class,'add']);
  // Route::get('/update',[TaskController::class,'update']);
  Route::get('/fetch',[SprintController::class,'fetch']);
  Route::get('/delete',[SprintController::class,'delete']);
});

// /fetch/task/project