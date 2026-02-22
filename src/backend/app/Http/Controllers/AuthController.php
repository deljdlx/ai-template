<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Domain\Auth\Actions\LoginUserAction;
use App\Domain\Auth\Actions\RegisterUserAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AuthController extends Controller
{
    /**
     * Register a new user and return a Sanctum API token.
     *
     * Validates name, email (unique), and password (min 8, confirmed).
     * Returns 201 with user profile and plaintext token.
     */
    public function register(Request $request, RegisterUserAction $register): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $result = $register->execute($data);

        return response()->json([
            'user' => [
                'id' => $result['user']->id,
                'name' => $result['user']->name,
                'email' => $result['user']->email,
            ],
            'token' => $result['token'],
        ], 201);
    }

    /**
     * Authenticate with email/password and return a Sanctum API token.
     *
     * Delegates credential verification to LoginUserAction, which throws
     * ValidationException on failure (same message for wrong password
     * and non-existent email to prevent enumeration).
     */
    public function login(Request $request, LoginUserAction $login): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $result = $login->execute($data);

        return response()->json([
            'user' => [
                'id' => $result['user']->id,
                'name' => $result['user']->name,
                'email' => $result['user']->email,
            ],
            'token' => $result['token'],
        ]);
    }
}
