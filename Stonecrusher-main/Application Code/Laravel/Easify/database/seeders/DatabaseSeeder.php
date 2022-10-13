<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Str;

use App\Models\EasifyUser;
use App\Models\Project;
use App\Models\ProjectEasifyUser;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   *
   * @return void
   */
  public function run()
  {
    // \App\Models\User::factory(10)->create();
    $easify_users = [
      [
        'name' => 'Test User1',
        'email' => 'testuser1@gmail.com',
        'email_verified_at' => now(),
        'password' => 'test', // password
        'remember_token' => Str::random(60),
        'image_url' => 'image_url',
      ], 
      [
        'name' => 'Test User 2',
        'email' => 'testuser2@gmail.com',
        'email_verified_at' => now(),
        'password' => 'test', // password
        'remember_token' => Str::random(60),
        'image_url' => 'image_url',
      ], 
      [
        'name' => 'Test User 3',
        'email' => 'testuser3@gmail.com',
        'email_verified_at' => now(),
        'password' => 'test', // password
        'remember_token' => Str::random(60),
        'image_url' => 'image_url',
      ]
    ];

    $projects = [
      [
        'title' => 'BookMyPhone',
        'image_url' => 'image_url', 
        'owner_id' => '1',
        'unique_key_name' => 'BMP', 
      ], 
      [
        'title' => 'Smart Canteen',
        'image_url' => 'image_url', 
        'owner_id' => '2',
        'unique_key_name' => 'SC', 
      ], 
      [
        'title' => 'Seating Arrangement System',
        'image_url' => 'image_url', 
        'owner_id' => '3',
        'unique_key_name' => 'SAS', 
      ]
    ];

    $project_easify_users = [
      [
        'project_id' => 1,
        'easify_user_id' => 1,
        'role' => 'Product Owner',
      ], 
      [
        'project_id' => 1,
        'easify_user_id' => 2,
        'role' => 'Scrum Master',
      ], 
      [
        'project_id' => 1,
        'easify_user_id' => 3,
        'role' => 'Developer',
      ], 
      [
        'project_id' => 2,
        'easify_user_id' => 1,
        'role' => 'Scrum Master',
      ], 
      [
        'project_id' => 2,
        'easify_user_id' => 2,
        'role' => 'Product Owner',
      ], 
      [
        'project_id' => 2,
        'easify_user_id' => 3,
        'role' => 'Developer',
      ], 
      [
        'project_id' => 3,
        'easify_user_id' => 1,
        'role' => 'Developer',
      ], 
      [
        'project_id' => 3,
        'easify_user_id' => 2,
        'role' => 'Scrum Master',
      ], 
      [
        'project_id' => 3,
        'easify_user_id' => 3,
        'role' => 'Product Owner',
      ], 
    ];
    // EasifyUser::factory()->count(1)->create();
    foreach ($easify_users as $easify_user){
      EasifyUser::create($easify_user);
    }
    foreach ($projects as $project){
      Project::create($project);
    }
    foreach ($project_easify_users as $project_easify_user){
      ProjectEasifyUser::create($project_easify_user);
    }
  }
}
