<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Alumno extends Migration
{
    public function up()
    {
        // Cambiamos 'table' por 'create' para que Laravel cree la tabla físicamente
        Schema::create('alumno', function (Blueprint $table) {
            $table->id(); // El ID o código automático [cite: 42]
            $table->string('nombre'); // Campo solicitado en la guía [cite: 31]
            $table->string('apellido'); // Campo solicitado en la guía [cite: 31]
            $table->timestamps(); // Crea las columnas de fecha de registro automáticamente [cite: 33]
        });
    }

    public function down()
    {
        Schema::dropIfExists('alumno');
    }
}