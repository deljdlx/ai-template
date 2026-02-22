<?php

declare(strict_types=1);

namespace App\Domain\Auth\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class RegisterUserAction
{
    /**
     * Create a new user account and generate an initial Sanctum API token.
     *
     * @param  array{name: string, email: string, password: string}  $data
     * @return array{user: User, token: string}
     */
    public function execute(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
