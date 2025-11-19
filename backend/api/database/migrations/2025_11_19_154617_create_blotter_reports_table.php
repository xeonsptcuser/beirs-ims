<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blotter_reports', function (Blueprint $table) {
            $table->id()->unsigned()->primary();
            $table->foreignId('user_profile_id')->constrained('user_profiles')->cascadeOnDelete(); // foreign key to users
            $table->foreignId('handler_id')->constrained('user_profiles')->cascadeOnDelete(); // foreign key to handler/staff
            $table->string('incident_type');
            $table->string('incident_title')->nullable();
            $table->datetime('datetime_of_incident');
            $table->string('location');
            $table->string('landmark')->nullable();
            $table->json('person_involved')->nullable();
            $table->json('witnesses')->nullable();
            $table->string('description');
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blotter_reports');
    }
};
