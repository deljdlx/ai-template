<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FeatureFlagController;
use App\Http\Controllers\InfosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');

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

// TODO(codex): protect feature-flags endpoints with auth/permissions when RBAC is enabled.
Route::prefix('feature-flags')->group(function (): void {
    Route::get('/', [FeatureFlagController::class, 'index'])->name('feature-flags.index');
    Route::post('/', [FeatureFlagController::class, 'store'])->name('feature-flags.store');
    Route::put('/{name}', [FeatureFlagController::class, 'update'])->name('feature-flags.update');
    Route::delete('/{name}', [FeatureFlagController::class, 'destroy'])->name('feature-flags.destroy');
});
