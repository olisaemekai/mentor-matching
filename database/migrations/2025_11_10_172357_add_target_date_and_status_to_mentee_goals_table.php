<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mentee_goals', function (Blueprint $table) {
            $table->date('target_date')->nullable();
            $table->enum('status', ['active', 'completed', 'abandoned'])->default('active');
            $table->text('progress_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mentee_goals', function (Blueprint $table) {
            $table->dropColumn(['target_date', 'status', 'progress_notes']);
        });
    }
};
