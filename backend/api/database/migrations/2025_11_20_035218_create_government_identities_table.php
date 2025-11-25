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
        Schema::create('government_identity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_profile_id')->constrained('user_profiles')->cascadeOnDelete(); // foreign key to user profile
            $table->string('storage_path');      // e.g., storage/app/evidences/...
            $table->string('identity_type');      // e.g., e.g drivers license, national id
            $table->string('original_name');     // filename the user uploaded
            $table->string('mime_type', 100);    // image/png, application/pdf, etc.
            $table->unsignedBigInteger('size');  // bytes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('government_identities');
    }
};
