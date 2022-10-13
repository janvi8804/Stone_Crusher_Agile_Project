<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\EasifyUser;
use App\Models\Project;
use App\Models\Sprint;

class Task extends Model
{
  use HasFactory;

  protected $fillable = [
    'name', 
    'unique_key_number', 
    'priority', 
    'type', 
    'progress', 
    'project_id', 
    'sprint_id', 
    'created_by',
  ];

  public function easify_user() {
    return $this->belongsTo(EasifyUser::class, 'created_by', 'id');
  }

  public function project() {
    return $this->belongsTo(Project::class, 'project_id', 'id');
  }

  public function sprint() {
    return $this->belongsTo(Sprint::class, 'sprint_id', 'unique_key_number');
  }
}
