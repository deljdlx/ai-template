<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $runtime['app_name'] }} — Stack Dashboard</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
                },
            },
        }
    </script>
</head>
<body class="bg-gray-50 text-gray-800 font-sans antialiased min-h-screen">

    {{-- Header --}}
    <header class="bg-white border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-6 py-8">
            <div class="flex items-center gap-4">
                <div class="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl shadow-lg shadow-red-500/25">
                    <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 19h20L12 2zm0 4l7.5 13h-15L12 6z"/>
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ $runtime['app_name'] }}</h1>
                    <p class="text-sm text-gray-500">{{ $laravel['framework'] }} {{ $laravel['laravel_version'] }} &middot; PHP {{ $php['php_version'] }}</p>
                </div>
            </div>
        </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {{-- Stack Info Cards --}}
        <section>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Stack Overview</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

                {{-- Laravel Card --}}
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/>
                            </svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">Laravel</h3>
                    </div>
                    <dl class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Version</dt>
                            <dd class="font-medium text-gray-900">{{ $laravel['laravel_version'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Environment</dt>
                            <dd>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                    {{ $laravel['environment'] === 'production' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800' }}">
                                    {{ $laravel['environment'] }}
                                </span>
                            </dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Debug</dt>
                            <dd>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                    {{ $laravel['debug'] ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600' }}">
                                    {{ $laravel['debug'] ? 'ON' : 'OFF' }}
                                </span>
                            </dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Locale</dt>
                            <dd class="font-medium text-gray-900">{{ $laravel['locale'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Cache</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $laravel['cache_driver'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Queue</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $laravel['queue_driver'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Database</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $laravel['database_driver'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Session</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $laravel['session_driver'] }}</dd>
                        </div>
                    </dl>
                </div>

                {{-- PHP Card --}}
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                            </svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">PHP</h3>
                    </div>
                    <dl class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Version</dt>
                            <dd class="font-medium text-gray-900">{{ $php['php_version'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">SAPI</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $php['sapi'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Memory Limit</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $php['memory_limit'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Max Exec Time</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $php['max_execution_time'] }}s</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Extensions</dt>
                            <dd class="font-medium text-gray-900">{{ count($php['extensions']) }}</dd>
                        </div>
                    </dl>

                    <details class="mt-4">
                        <summary class="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800 font-medium">
                            Show all extensions
                        </summary>
                        <div class="mt-2 flex flex-wrap gap-1">
                            @foreach($php['extensions'] as $ext)
                                <span class="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-mono">{{ $ext }}</span>
                            @endforeach
                        </div>
                    </details>
                </div>

                {{-- Runtime Card --}}
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 class="font-semibold text-gray-900">Runtime</h3>
                    </div>
                    <dl class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <dt class="text-gray-500">App Name</dt>
                            <dd class="font-medium text-gray-900">{{ $runtime['app_name'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Timezone</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $runtime['server_timezone'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Server Time</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $runtime['timestamp'] }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-gray-500">UTC Time</dt>
                            <dd class="font-mono text-xs text-gray-700">{{ $runtime['utc_timestamp'] }}</dd>
                        </div>
                    </dl>

                    <div class="mt-5 pt-4 border-t border-gray-100">
                        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">API Endpoints</h4>
                        <div class="space-y-1.5 text-xs font-mono">
                            <div class="flex items-center gap-2">
                                <span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-semibold text-[10px]">GET</span>
                                <span class="text-gray-600">/api/infos</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-semibold text-[10px]">GET</span>
                                <span class="text-gray-600">/api/infos/packages</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold text-[10px]">CRUD</span>
                                <span class="text-gray-600">/api/feature-flags</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-semibold text-[10px]">POST</span>
                                <span class="text-gray-600">/api/auth/*</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {{-- Packages Section --}}
        <section>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Installed Packages
                <span class="text-sm font-normal text-gray-500">({{ count($packages) + count($devPackages) }} total)</span>
            </h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {{-- Production Packages --}}
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="px-5 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                            Production
                            <span class="text-gray-400 font-normal">({{ count($packages) }})</span>
                        </h3>
                    </div>
                    <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        @foreach($packages as $pkg)
                            <div class="px-5 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div class="min-w-0">
                                    <span class="text-sm font-medium text-gray-900 truncate block">{{ $pkg['name'] }}</span>
                                    <span class="text-[11px] text-gray-400 font-mono">{{ $pkg['constraint'] }}</span>
                                </div>
                                @if($pkg['version'])
                                    <span class="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0 ml-3">{{ $pkg['version'] }}</span>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- Dev Packages --}}
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="px-5 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
                            Development
                            <span class="text-gray-400 font-normal">({{ count($devPackages) }})</span>
                        </h3>
                    </div>
                    <div class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        @foreach($devPackages as $pkg)
                            <div class="px-5 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div class="min-w-0">
                                    <span class="text-sm font-medium text-gray-900 truncate block">{{ $pkg['name'] }}</span>
                                    <span class="text-[11px] text-gray-400 font-mono">{{ $pkg['constraint'] }}</span>
                                </div>
                                @if($pkg['version'])
                                    <span class="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0 ml-3">{{ $pkg['version'] }}</span>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

    </main>

    {{-- Footer --}}
    <footer class="border-t border-gray-200 mt-10">
        <div class="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-gray-400">
            {{ $laravel['framework'] }} v{{ $laravel['laravel_version'] }} &middot; PHP {{ $php['php_version'] }} &middot; {{ $runtime['server_timezone'] }}
        </div>
    </footer>

</body>
</html>
