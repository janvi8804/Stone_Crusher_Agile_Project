<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use App\Models\EasifyUser;

class EasifyUserController extends Controller
{
  public function fetchAllUser() {

    return Response::json([
      'data' => [
        'easify_user_data' => EasifyUser::all(), 
      ],
      'status' => 200,
      'success' => "User Details successfuly fetched."
    ], 200);
  }

  public function login(Request $request) {

    $validate =  Validator::make($request->all(), [
      'email' => ['required'],
      'password' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    $easify_user = EasifyUser::class;

    $login = [
      'email' => $request->email,
      'password' => $request->password,
    ];

    if ($easify_user::firstWhere(['email' => $request->email])) {
      $login = EasifyUser::where('email', $request->email)
      ->first();

      $profile = [
        'id' => $login->id,
        'email' => $login->email,
        'name' => $login->name,
        // 'image_url' => $image,
      ];

      if(Hash::check($request->password, $login->password)) {
        return Response::json([
          'data' => [$profile],
          'status' => 200,
          'success' => "Login successfuly."
        ], 200);
      } else {
        return Response::json([
          'data' => [],
          'status' => 201,
          'error' => "Authentication Failed - Incorrect Password.", 
          'print_error' => "Authentication Failed - Incorrect Password."
        ], 200);
      }
    } else {
      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Authentication Failed - Incorrect Email ID.", 
        'print_error' => "This account doesn't exists, please create new account or login with registered email id."
      ], 200);
    }
  }

  public function register(Request $request) {

    $validate =  Validator::make($request->all(), [
      'email' => ['required'],
      'password' => ['required'],
      'name' => ['required'],
      // 'image_url' => ['required'],
    ]);

    if ($validate->fails()) {
      return Response::json([
        'data' => [],
        'status' => 401,
        'error' => $validate->errors(),
      ], 200);
    }

    $easify_user = EasifyUser::class;

    if ($easify_user::firstWhere(['email' => $request->email])) {

      return Response::json([
        'data' => [],
        'status' => 201,
        'error' => "Email ID must be Unique. Email ID already Exists.", 
        'print_error' => "This account already exists, please login or create account with different email id."
      ], 200);
    } else {

      $new_user = [
        'name' => $request->name,
        'email' => $request->email,
        'email_verified_at' => now(),
        'password' => $request->password,
        'remember_token' => Str::random(60),
        'image_url' => '$request->image_url',
      ];

      EasifyUser::create($new_user);

      $login = EasifyUser::where('email', $request->email)
      ->first();

      $profile = [
        'id' => $login->id,
        'email' => $login->email,
        'name' => $login->name,
        // 'image_url' => $image,
      ];

      return Response::json([
        'data' => [$profile],
        'status' => 200,
        'success' => "User details successfuly added."
      ], 200);
    }
  }
}
