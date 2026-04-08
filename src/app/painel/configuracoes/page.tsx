'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Users, Bell, Shield, Database, Key, RefreshCw } from 'lucide-react'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral')

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'notificacoes', label: 'Notificacoes', icon: Bell },
    { id: 'seguranca', label: 'Seguranca', icon: Shield },
    { id: 'integracoes', label: 'Integracoes', icon: Database },
    { id: 'api', label: 'Chaves API', icon: Key },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-muted-foreground">Gerencie as configuracoes do sistema</p>
      </div>

      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <Card className="glass-panel">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-ori-pink/20 text-ori-pink'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {activeTab === 'geral' && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Configuracoes Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Sistema</label>
                  <input type="text" defaultValue="O.R.I - Observatorio de Resultados e Inovacao" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL do GLPI</label>
                  <input type="url" placeholder="https://glpi.exemplo.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL do Painel</label>
                  <input type="url" placeholder="https://ori.exemplo.com" className="input-field" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium">Sincronizacao RH</p>
                    <p className="text-sm text-muted-foreground">Ultima sync: 15 minutos atras</p>
                  </div>
                  <Button variant="outline" className="btn-secondary">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar
                  </Button>
                </div>
                <Button className="btn-primary">Salvar Alteracoes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'seguranca' && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Seguranca</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium">Autenticacao em duas etapas</p>
                    <p className="text-sm text-muted-foreground">Exigir 2FA para todos os usuarios</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium">Sessoes ativas</p>
                    <p className="text-sm text-muted-foreground">Gerenciar sessoes ativas</p>
                  </div>
                  <Button variant="outline" className="btn-secondary">Ver Sessoes</Button>
                </div>
                <div className="p-4 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-yellow-400">Recomendamos alterar as chaves de API a cada 6 meses.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'integracoes' && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Integracoes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'GLPI', status: 'connected', desc: 'Sistema de gerenciamento de tickets' },
                  { name: 'Zoho Cliq', status: 'connected', desc: 'Canal de comunicacao com o bot' },
                  { name: 'Supabase', status: 'connected', desc: 'Banco de dados e autenticacao' },
                  { name: 'Google Gemini', status: 'connected', desc: 'Motor de IA para triagem' },
                  { name: 'Carbonio', status: 'pending', desc: 'Servidor de email' },
                  { name: 'Zentyal', status: 'pending', desc: 'Controller de dominio' },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.desc}</p>
                    </div>
                    <Badge className={integration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {integration.status === 'connected' ? 'Conectado' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Supabase Service Key', lastUsed: 'Agora' },
                  { name: 'Gemini API Key', lastUsed: '5 min atras' },
                  { name: 'Zoho Client Secret', lastUsed: '1 hora atras' },
                  { name: 'GLPI App Token', lastUsed: '10 min atras' },
                  { name: 'Cron Secret', lastUsed: 'Nunca' },
                ].map((key) => (
                  <div key={key.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <p className="text-sm text-muted-foreground">Ultimo uso: {key.lastUsed}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="btn-secondary">Ver</Button>
                      <Button variant="outline" size="sm" className="btn-secondary">Rotacionar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}