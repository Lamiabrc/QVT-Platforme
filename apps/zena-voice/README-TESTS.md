# 🧪 Tests - QVT Box Zena

## 📋 Vue d'ensemble

Ce projet utilise **Vitest** et **React Testing Library** pour les tests unitaires et d'intégration.

## 🚀 Lancer les tests

### Tous les tests
```bash
npm run test
```

### Mode watch (développement)
```bash
npm run test:watch
```

### Avec couverture
```bash
npm run test:coverage
```

## 📁 Structure des tests

```
src/__tests__/
├── setup.ts                          # Configuration Vitest
├── VoiceControl.test.tsx            # Tests composant VoiceControl
├── ZenaAvatar.test.tsx              # Tests composant ZenaAvatar
├── useVoiceRecognition.test.ts      # Tests hook reconnaissance vocale
├── useZenaZenoBrain.test.ts         # Tests hook cerveau IA
├── VoiceRecognitionService.test.ts  # Tests service reconnaissance
└── integration/
    └── VoiceChat.test.tsx           # Tests d'intégration
```

## 🎯 Couverture actuelle

### Composants
- ✅ **VoiceControl** - Composant de contrôle vocal
- ✅ **ZenaAvatar** - Avatar animé de Zena

### Hooks
- ✅ **useVoiceRecognition** - Hook de reconnaissance vocale
- ✅ **useZenaZenoBrain** - Hook du cerveau IA de Zena

### Services
- ✅ **VoiceRecognitionService** - Service de reconnaissance vocale (Browser + Cloud)

### Intégration
- ✅ **ZenaChat** - Page complète de chat avec Zena

## 🔧 Configuration

La configuration Vitest se trouve dans `vitest.config.ts` :

```typescript
{
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/__tests__/setup.ts'],
  include: ['src/__tests__/**/*.test.{ts,tsx}'],
}
```

## 📝 Scripts package.json

Ajoutez ces scripts à votre `package.json` :

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 🎨 Bonnes pratiques

### 1. Nommage des fichiers
- Tests unitaires : `ComponentName.test.tsx`
- Tests d'intégration : dans `integration/`

### 2. Structure d'un test
```typescript
describe('ComponentName', () => {
  it('doit faire quelque chose', () => {
    // Arrange
    const { container } = render(<Component />);
    
    // Act
    // ... actions utilisateur
    
    // Assert
    expect(container).toBeDefined();
  });
});
```

### 3. Mocking
- Mocker les hooks externes
- Mocker les appels API
- Mocker les services tiers

### 4. Tests à écrire
- ✅ Rendu des composants
- ✅ Interactions utilisateur
- ✅ États et props
- ✅ Hooks personnalisés
- ✅ Services
- ✅ Intégration entre composants

## 🐛 Debugging

### Afficher le DOM
```typescript
const { debug } = render(<Component />);
debug(); // Affiche le DOM dans la console
```

### Logs
Les tests incluent des `console.log` pour débugger :
```typescript
console.log("📝 Test:", testName);
```

## 🔍 Tests manquants à ajouter

### Composants
- [ ] ChatInterface
- [ ] RoleSelector
- [ ] BoxRecommendation
- [ ] BottomNav

### Hooks
- [ ] useZenaVoice
- [ ] useAudioAnalyzer
- [ ] useSpeechSynthesis
- [ ] useAuth

### Pages
- [ ] Index
- [ ] Dashboard
- [ ] WellnessHub
- [ ] Auth

### Edge Functions
- [ ] qvt-ai

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

## ❓ FAQ

### Q: Comment mocker un hook Supabase ?
```typescript
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
  },
}));
```

### Q: Comment tester les événements utilisateur ?
```typescript
const button = container.querySelector('button');
fireEvent.click(button);
```

### Q: Comment tester les hooks personnalisés ?
```typescript
const { result } = renderHook(() => useCustomHook());
expect(result.current.value).toBe(expectedValue);
```

## 🎯 Objectifs de couverture

- **Composants**: > 80%
- **Hooks**: > 80%
- **Services**: > 80%
- **Intégration**: > 60%

---

**Note**: Pour toute question sur les tests, consultez la documentation ou ouvrez une issue.
