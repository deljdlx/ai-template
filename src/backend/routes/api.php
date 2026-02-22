<?php

use App\Http\Controllers\InfosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('infos')->group(function (): void {
    Route::get('/', [InfosController::class, 'index'])->name('infos.index');
    Route::get('/laravel', [InfosController::class, 'laravel'])->name('infos.laravel');
    Route::get('/php', [InfosController::class, 'php'])->name('infos.php');
    Route::get('/runtime', [InfosController::class, 'runtime'])->name('infos.runtime');
    Route::get('/packages', [InfosController::class, 'packages'])->name('infos.packages');
});
