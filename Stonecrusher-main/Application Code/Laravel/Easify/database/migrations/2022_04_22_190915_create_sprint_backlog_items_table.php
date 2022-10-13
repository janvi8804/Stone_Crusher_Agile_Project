<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sprint_backlog_items', function (Blueprint $table) {
          $table->bigIncrements('id');
          $table->string('progress');
          $table->string('sprint_id');
          $table->string('product_backlog_item_id');
          $table->string('project_id');
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sprint_backlog_items');
    }
};
