<?php

declare(strict_types=1);

use App\Domain\Auth\Actions\RegisterUserAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(Tests\TestCase::class, RefreshDatabase::class);

it('creates a user and returns user with token', function () {
    $result = (new RegisterUserAction)->execute([
        'name' => 'Alice',
        'email' => 'alice@example.com',
        'password' => 'secret123',
    ]);

    expect($result)->toHaveKeys(['user', 'token']);
    expect($result['user'])->toBeInstanceOf(User::class);
    expect($result['token'])->toBeString()->not->toBeEmpty();
});

it('persists the user in database', function () {
    (new RegisterUserAction)->execute([
        'name' => 'Bob',
        'email' => 'bob@example.com',
        'password' => 'secret123',
    ]);

    expect(User::where('email', 'bob@example.com')->exists())->toBeTrue();
});

it('hashes the password', function () {
    $result = (new RegisterUserAction)->execute([
        'name' => 'Carol',
        'email' => 'carol@example.com',
        'password' => 'plaintext123',
    ]);

    $user = User::find($result['user']->id);

    expect(Hash::check('plaintext123', $user->password))->toBeTrue();
    expect($user->password)->not->toBe('plaintext123');
});

it('generates a sanctum api token', function () {
    $result = (new RegisterUserAction)->execute([
        'name' => 'Dave',
        'email' => 'dave@example.com',
        'password' => 'secret123',
    ]);

    expect($result['user']->tokens)->toHaveCount(1);
    expect($result['token'])->toContain('|');
});
