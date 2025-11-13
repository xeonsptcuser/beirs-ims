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
        Schema::create('certificate_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_profile_id'); // foreign key to users
            $table->string('cert_request_type');
            $table->date('start_residency_date')->nullable();
            $table->date('end_residency_date')->nullable();
            $table->string('cert_request_reason');
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_requests');
    }
};
