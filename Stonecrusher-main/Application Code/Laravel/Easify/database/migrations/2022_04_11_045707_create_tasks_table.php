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
        Schema::create('tasks', function (Blueprint $table) {
          $table->bigIncrements('id');
          $table->string('name');
          $table->integer('unique_key_number');
          $table->string('priority');
          $table->string('type');
          $table->string('progress');
          $table->string('project_id');
          $table->string('sprint_id');
          $table->string('created_by');
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
        Schema::dropIfExists('tasks');
    }
};
