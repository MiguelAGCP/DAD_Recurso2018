<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPlayer1Player2Player3Player4ToGameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('games', function($table) {
            $table->string('player1')->nullable()->default(null);
            $table->string('player2')->nullable()->default(null);
            $table->string('player3')->nullable()->default(null);
            $table->string('player4')->nullable()->default(null);          

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    });

    }
}
