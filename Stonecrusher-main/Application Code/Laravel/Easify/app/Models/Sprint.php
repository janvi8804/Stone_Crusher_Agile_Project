<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
  use HasFactory;

  protected $fillable = [
    'name', 
    'unique_key_number', 
    'duration', 
    'project_id', 
  ];
}
