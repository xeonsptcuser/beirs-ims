<?php

namespace App\Providers;

use App\Interfaces\UsersRepositoryInterface;
use App\Repositories\UsersRepositoryImpl;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(UsersRepositoryInterface::class, UsersRepositoryImpl::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
