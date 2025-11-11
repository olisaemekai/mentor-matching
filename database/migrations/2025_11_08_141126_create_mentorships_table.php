<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentor_capacity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_id')->constrained('users')->onDelete('cascade');
            $table->integer('max_mentees')->default(2);
            $table->integer('current_mentees')->default(0);
            $table->enum('availability_status', ['available', 'limited', 'full'])->default('available');
            $table->timestamps();
        });

        Schema::create('mentorship_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mentee_id')->constrained('users')->onDelete('cascade');
            $table->integer('compatibility_score');
            $table->enum('status', ['pending', 'active', 'on_hold', 'completed', 'discontinued'])->default('pending');
            $table->timestamp('matched_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['mentor_id', 'mentee_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentorship_matches');
        Schema::dropIfExists('mentor_capacity');
    }
};
