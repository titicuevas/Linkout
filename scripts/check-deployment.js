#!/usr/bin/env node

/**
 * Script de verificación para el despliegue en Railway
 * Verifica que todos los archivos y configuraciones necesarias estén presentes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🔍 Verificando configuración para despliegue en Railway...\n');

let allChecksPassed = true;

// Función para verificar si un archivo existe
function checkFile(filePath, description) {
  const fullPath = path.join(projectRoot, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} - FALTANTE`);
    allChecksPassed = false;
    return false;
  }
}

// Función para verificar contenido de package.json
function checkPackageJson(filePath, requiredScripts, description) {
  const fullPath = path.join(projectRoot, filePath);
  if (fs.existsSync(fullPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const missingScripts = requiredScripts.filter(script => !content.scripts?.[script]);
      
      if (missingScripts.length === 0) {
        console.log(`✅ ${description}`);
        return true;
      } else {
        console.log(`❌ ${description} - Scripts faltantes: ${missingScripts.join(', ')}`);
        allChecksPassed = false;
        return false;
      }
    } catch (error) {
      console.log(`❌ ${description} - Error al leer archivo`);
      allChecksPassed = false;
      return false;
    }
  } else {
    console.log(`❌ ${description} - Archivo no encontrado`);
    allChecksPassed = false;
    return false;
  }
}

// Verificaciones del Frontend
console.log('📁 FRONTEND:');
checkFile('railway.json', 'Configuración Railway para frontend');
checkFile('env.example', 'Variables de entorno de ejemplo (frontend)');
checkFile('package.json', 'Package.json principal');
checkPackageJson('package.json', ['dev', 'build', 'preview'], 'Scripts necesarios en package.json principal');

// Verificaciones del Backend
console.log('\n📁 BACKEND:');
checkFile('backend/railway.json', 'Configuración Railway para backend');
checkFile('backend/env.example', 'Variables de entorno de ejemplo (backend)');
checkFile('backend/package.json', 'Package.json del backend');
checkFile('backend/Procfile', 'Procfile para el backend');
checkPackageJson('backend/package.json', ['start'], 'Scripts necesarios en package.json del backend');

// Verificaciones de documentación
console.log('\n📚 DOCUMENTACIÓN:');
checkFile('README.md', 'README.md actualizado');
checkFile('docs/RAILWAY_DEPLOYMENT.md', 'Guía de despliegue en Railway');

// Verificaciones de código
console.log('\n💻 CÓDIGO:');
checkFile('src/services/supabase.js', 'Configuración de Supabase');
checkFile('backend/index.js', 'Servidor backend');

// Verificar que las URLs del backend usen variables de entorno
console.log('\n🔧 CONFIGURACIÓN DE VARIABLES DE ENTORNO:');

const frontendFiles = [
  'src/pages/animoia/index.jsx',
  'src/pages/retos/Fisico.jsx'
];

frontendFiles.forEach(file => {
  const fullPath = path.join(projectRoot, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('import.meta.env.VITE_BACKEND_URL')) {
      console.log(`✅ ${file} - Usa variables de entorno correctamente`);
    } else {
      console.log(`❌ ${file} - No usa variables de entorno para URL del backend`);
      allChecksPassed = false;
    }
  }
});

// Resumen final
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
  console.log('✅ Tu proyecto está listo para desplegar en Railway');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Sube tu código a GitHub');
  console.log('2. Sigue la guía en docs/RAILWAY_DEPLOYMENT.md');
  console.log('3. Configura las variables de entorno en Railway');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('🔧 Por favor, corrige los errores antes de desplegar');
}
console.log('='.repeat(50));

// Lista de variables de entorno necesarias
console.log('\n📝 VARIABLES DE ENTORNO NECESARIAS:');
console.log('\nFrontend:');
console.log('- VITE_SUPABASE_URL');
console.log('- VITE_SUPABASE_ANON_KEY');
console.log('- VITE_BACKEND_URL');

console.log('\nBackend:');
console.log('- GEMINI_API_KEY');
console.log('- PORT (Railway lo configura automáticamente)');

process.exit(allChecksPassed ? 0 : 1); 