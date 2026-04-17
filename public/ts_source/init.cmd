@echo off
cls
echo initting

npm init -y

(
echo { "compilerOptions": {
echo     "module": "nodenext",
echo     "target": "esnext",
echo     "types": ["chrome"],

echo     "strict": true,
echo     "sourceMap": false,
echo     "declaration": false,
echo     "declarationMap": false,

echo     "noUncheckedIndexedAccess": true,
echo     "exactOptionalPropertyTypes": true,
echo     "verbatimModuleSyntax": true,
echo     "isolatedModules": true,
echo     "noUncheckedSideEffectImports": true,
echo     "moduleDetection": "force",
echo     "skipLibCheck": true
echo }}
) > tsconfig.json

npm install @types/chrome --save-dev > nul