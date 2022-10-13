<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SprintBacklogItem extends Model
{
  use HasFactory;

  protected $fillable = [
    'progress', 
    'sprint_id', 
    'product_backlog_item_id', 
    'project_id', 
  ];
}
