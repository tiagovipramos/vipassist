#!/usr/bin/env node

/**
 * Script para testar o login do frontend
 * Simula o comportamento do navegador
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configurações
const DOMAIN = 'conectiva24h.com.br';
const BASE_URL = `https://${DOMAIN}`;

// Ignorar certificados SSL em desenvolvimento
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Cores para console
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Função para fazer requisições HTTP
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                ...options.headers
            },
            rejectUnauthorized: false
        };

        if (options.body) {
            requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
        }

        const req = client.request(requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    cookies: res.headers['set-cookie'] || []
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

// Função para extrair cookies
function extractCookies(cookieHeaders) {
    const cookies = {};
    if (cookieHeaders) {
        cookieHeaders.forEach(cookie => {
            const [nameValue] = cookie.split(';');
            const [name, value] = nameValue.split('=');
            if (name && value) {
                cookies[name.trim()] = value.trim();
            }
        });
    }
    return cookies;
}

// Função para converter cookies em string
function cookiesToString(cookies) {
    return Object.entries(cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
}

async function testLogin() {
    log('🔍 INICIANDO TESTE DE LOGIN DO FRONTEND', 'blue');
    log('==========================================', 'blue');
    
    try {
        // 1. Testar se o site está acessível
        log('\n[1/8] 🌐 Testando acesso ao site...', 'yellow');
        const siteResponse = await makeRequest(`${BASE_URL}/entrar`);
        log(`Status: ${siteResponse.statusCode}`, siteResponse.statusCode === 200 ? 'green' : 'red');
        
        if (siteResponse.statusCode !== 200) {
            log('❌ Site não está acessível!', 'red');
            return;
        }
        
        // 2. Testar endpoint de CSRF
        log('\n[2/8] 🔐 Obtendo CSRF token...', 'yellow');
        const csrfResponse = await makeRequest(`${BASE_URL}/api/auth/csrf`);
        log(`Status: ${csrfResponse.statusCode}`, csrfResponse.statusCode === 200 ? 'green' : 'red');
        
        let csrfToken = null;
        if (csrfResponse.statusCode === 200) {
            try {
                const csrfData = JSON.parse(csrfResponse.body);
                csrfToken = csrfData.csrfToken;
                log(`✓ CSRF Token: ${csrfToken.substring(0, 20)}...`, 'green');
            } catch (e) {
                log('❌ Erro ao parsear resposta do CSRF', 'red');
                log(`Resposta: ${csrfResponse.body}`, 'cyan');
            }
        }
        
        // 3. Testar endpoint de providers
        log('\n[3/8] 🔧 Verificando providers...', 'yellow');
        const providersResponse = await makeRequest(`${BASE_URL}/api/auth/providers`);
        log(`Status: ${providersResponse.statusCode}`, providersResponse.statusCode === 200 ? 'green' : 'red');
        
        if (providersResponse.statusCode === 200) {
            try {
                const providers = JSON.parse(providersResponse.body);
                log(`✓ Providers encontrados: ${Object.keys(providers).join(', ')}`, 'green');
            } catch (e) {
                log('❌ Erro ao parsear providers', 'red');
            }
        }
        
        // 4. Testar endpoint de sessão (antes do login)
        log('\n[4/8] 👤 Verificando sessão atual...', 'yellow');
        const sessionResponse = await makeRequest(`${BASE_URL}/api/auth/session`);
        log(`Status: ${sessionResponse.statusCode}`, sessionResponse.statusCode === 200 ? 'green' : 'red');
        
        if (sessionResponse.statusCode === 200) {
            try {
                const session = JSON.parse(sessionResponse.body);
                if (session.user) {
                    log(`✓ Usuário já logado: ${session.user.email}`, 'green');
                } else {
                    log('✓ Nenhuma sessão ativa', 'cyan');
                }
            } catch (e) {
                log('❌ Erro ao parsear sessão', 'red');
            }
        }
        
        // 5. Tentar fazer login
        if (csrfToken) {
            log('\n[5/8] 🔑 Tentando fazer login...', 'yellow');
            
            const loginData = new URLSearchParams({
                email: 'admin@vipassist.com',
                password: 'admin123',
                csrfToken: csrfToken,
                callbackUrl: `${BASE_URL}/painel`,
                json: 'true'
            }).toString();
            
            const loginResponse = await makeRequest(`${BASE_URL}/api/auth/callback/credentials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: loginData
            });
            
            log(`Status: ${loginResponse.statusCode}`, loginResponse.statusCode === 200 ? 'green' : 'red');
            log(`Resposta: ${loginResponse.body}`, 'cyan');
            
            // Verificar cookies de autenticação
            const loginCookies = extractCookies(loginResponse.cookies);
            log('\n📋 Cookies recebidos:', 'yellow');
            Object.entries(loginCookies).forEach(([name, value]) => {
                if (name.includes('next-auth') || name.includes('session')) {
                    log(`  ${name}: ${value.substring(0, 30)}...`, 'cyan');
                } else {
                    log(`  ${name}: ${value}`, 'cyan');
                }
            });
            
            // 6. Verificar sessão após login
            log('\n[6/8] ✅ Verificando sessão após login...', 'yellow');
            const cookieString = cookiesToString(loginCookies);
            
            const postLoginSessionResponse = await makeRequest(`${BASE_URL}/api/auth/session`, {
                headers: {
                    'Cookie': cookieString
                }
            });
            
            log(`Status: ${postLoginSessionResponse.statusCode}`, postLoginSessionResponse.statusCode === 200 ? 'green' : 'red');
            
            if (postLoginSessionResponse.statusCode === 200) {
                try {
                    const session = JSON.parse(postLoginSessionResponse.body);
                    if (session.user) {
                        log(`✅ LOGIN SUCESSO! Usuário: ${session.user.email}`, 'green');
                        log(`   Nome: ${session.user.name}`, 'green');
                        log(`   Role: ${session.user.role}`, 'green');
                    } else {
                        log('❌ Login falhou - Nenhuma sessão criada', 'red');
                    }
                } catch (e) {
                    log('❌ Erro ao parsear sessão pós-login', 'red');
                    log(`Resposta: ${postLoginSessionResponse.body}`, 'cyan');
                }
            }
            
            // 7. Testar acesso a página protegida
            log('\n[7/8] 🔒 Testando acesso a página protegida...', 'yellow');
            const protectedResponse = await makeRequest(`${BASE_URL}/painel`, {
                headers: {
                    'Cookie': cookieString
                }
            });
            
            log(`Status: ${protectedResponse.statusCode}`, protectedResponse.statusCode === 200 ? 'green' : 'red');
            
            if (protectedResponse.statusCode === 200) {
                log('✅ Acesso à página protegida OK', 'green');
            } else if (protectedResponse.statusCode === 302 || protectedResponse.statusCode === 307) {
                log(`🔄 Redirecionamento para: ${protectedResponse.headers.location}`, 'yellow');
            } else {
                log('❌ Acesso negado à página protegida', 'red');
            }
        }
        
        // 8. Teste de logout
        log('\n[8/8] 🚪 Testando logout...', 'yellow');
        const logoutResponse = await makeRequest(`${BASE_URL}/api/auth/signout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `csrfToken=${csrfToken}`
        });
        
        log(`Status: ${logoutResponse.statusCode}`, logoutResponse.statusCode === 200 ? 'green' : 'red');
        
    } catch (error) {
        log(`❌ Erro durante o teste: ${error.message}`, 'red');
        console.error(error);
    }
    
    log('\n==========================================', 'blue');
    log('🏁 TESTE CONCLUÍDO', 'blue');
}

// Executar teste
testLogin();
