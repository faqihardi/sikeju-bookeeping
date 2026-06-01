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
        Schema::table('hutangs', function (Blueprint $table) {
            $table->unique('pembelian_id');
            $table->unique('peralatan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hutangs', function (Blueprint $table) {
            $table->dropUnique(['pembelian_id']);
            $table->dropUnique(['peralatan_id']);
        });
    }
};