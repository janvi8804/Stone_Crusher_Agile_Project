<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectEasifyUser extends Model
{
  use HasFactory;

  protected $fillable = [
    'project_id',
    'easify_user_id',
    'role', 
  ];
}
