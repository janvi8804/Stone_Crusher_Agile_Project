<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\EasifyUser;
use App\Models\Task;

class Project extends Model
{
  use HasFactory;

  protected $fillable = [
    'title',
    'image_url', 
    'owner_id',
    'unique_key_name'
  ];

  public function easify_user() {
    return $this->belongsToMany(EasifyUser::class, 'project_easify_users', 'project_id', 'easify_user_id');
  }

  public function task() {
    return $this->hasMany(Task::class, 'project_id', 'id');
  }
}
