<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Project;
use App\Models\Task;

class EasifyUser extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'email',
    'email_verified_at',
    'password',
    'remember_token',
    'image_url',
  ];

  protected $hidden = [
    'password',
    'remember_token',
  ];

  public function setPasswordAttribute($value){
    $this->attributes['password'] = bcrypt($value);
  }

  public function project() {
    return $this->belongsToMany(Project::class, 'project_easify_users', 'easify_user_id', 'project_id');
  }

  public function task() {
    return $this->hasMany(Task::class, 'created_by', 'id');
  }
}
