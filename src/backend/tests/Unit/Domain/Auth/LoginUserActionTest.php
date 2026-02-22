<?php

declare(strict_types=1);

use App\Domain\Auth\Actions\LoginUserAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

uses(Tests\TestCase::class, RefreshDatabase::class);

it('authenticates valid credentials and returns user with token', function () {
    User::factory()->create([
        'email' => 'alice@example.com',
        'password' => bcrypt('secret123'),
    ]);

    $result = (new LoginUserAction)->execute([
        'email' => 'alice@example.com',
        'password' => 'secret123',
    ]);

    expect($result)->toHaveKeys(['user', 'token']);
    expect($result['user'])->toBeInstanceOf(User::class);
    expect($result['user']->email)->toBe('alice@example.com');
    expect($result['token'])->toBeString()->not->toBeEmpty();
});

it('throws validation exception for wrong password', function () {
    User::factory()->create([
        'email' => 'bob@example.com',
        'password' => bcrypt('correct'),
    ]);

    (new LoginUserAction)->execute([
        'email' => 'bob@example.com',
        'password' => 'wrong',
    ]);
})->throws(ValidationException::class);

it('throws validation exception for non-existent user', function () {
    (new LoginUserAction)->execute([
        'email' => 'nobody@example.com',
        'password' => 'anything',
    ]);
})->throws(ValidationException::class);

it('includes email key in validation error messages', function () {
    try {
        (new LoginUserAction)->execute([
            'email' => 'nobody@example.com',
            'password' => 'anything',
        ]);
    } catch (ValidationException $e) {
        expect($e->errors())->toHaveKey('email');
        expect($e->errors()['email'][0])->toBe('The provided credentials are incorrect.');

        return;
    }

    $this->fail('Expected ValidationException was not thrown.');
});

it('generates a new token on each login', function () {
    $user = User::factory()->create([
        'email' => 'carol@example.com',
        'password' => bcrypt('secret123'),
    ]);

    $action = new LoginUserAction;

    $result1 = $action->execute(['email' => 'carol@example.com', 'password' => 'secret123']);
    $result2 = $action->execute(['email' => 'carol@example.com', 'password' => 'secret123']);

    expect($result1['token'])->not->toBe($result2['token']);
    expect($user->tokens)->toHaveCount(2);
});
