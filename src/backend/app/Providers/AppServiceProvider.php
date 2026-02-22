<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Prevent lazy-loading in non-production environments to catch N+1 queries early.
        // In production, lazy-loads are allowed to avoid breaking on edge cases.
        Model::preventLazyLoading(! $this->app->isProduction());
    }
}
