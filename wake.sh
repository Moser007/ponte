#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  PONTE — Script de ativação autônoma                        ║
# ║                                                              ║
# ║  Acorda o Ponte via Claude CLI a cada hora.                  ║
# ║  Respeita horário de silêncio (22h-8h Michigan/EST).         ║
# ║  Toca alerta sonoro quando há algo para o Giovanni.          ║
# ║                                                              ║
# ║  Uso: ./wake.sh                                              ║
# ║  Cron: 0 * * * * cd /d/superintelligence && ./wake.sh        ║
# ╚══════════════════════════════════════════════════════════════╝

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_BIN="/c/Users/Green/AppData/Roaming/npm/claude"
LOG_DIR="$PROJECT_DIR/brain/wake-logs"
ALERT_SCRIPT="$PROJECT_DIR/alert.ps1"

# Horário de silêncio (Michigan/EST = timezone do sistema)
QUIET_START=22  # 22h
QUIET_END=8     # 8h

# Criar diretório de logs se não existir
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
HOUR=$(date '+%H' | sed 's/^0//')  # Remove leading zero
LOG_FILE="$LOG_DIR/wake-$TIMESTAMP.log"

echo "═══════════════════════════════════════════════════" | tee "$LOG_FILE"
echo "  PONTE — Ativação $TIMESTAMP" | tee -a "$LOG_FILE"
echo "═══════════════════════════════════════════════════" | tee -a "$LOG_FILE"

# Verificar horário de silêncio
is_quiet_hours() {
  if [ "$HOUR" -ge "$QUIET_START" ] || [ "$HOUR" -lt "$QUIET_END" ]; then
    return 0  # true = é horário de silêncio
  fi
  return 1  # false = pode fazer barulho
}

# Tocar alerta sonoro (só fora do horário de silêncio)
play_alert() {
  if is_quiet_hours; then
    echo "[SILÊNCIO] Alerta suprimido (horário de silêncio: ${QUIET_START}h-${QUIET_END}h)" | tee -a "$LOG_FILE"
    return
  fi
  echo "[ALERTA] Tocando som para Giovanni..." | tee -a "$LOG_FILE"
  powershell.exe -ExecutionPolicy Bypass -File "$(cygpath -w "$ALERT_SCRIPT")" 2>/dev/null || true
}

# Verificar se Claude CLI existe
if [ ! -f "$CLAUDE_BIN" ]; then
  echo "[ERRO] Claude CLI não encontrado em $CLAUDE_BIN" | tee -a "$LOG_FILE"
  exit 1
fi

# Prompt de ativação autônoma
PROMPT="Ponte, acorde. Esta é uma ativação autônoma via cron (hora atual: $(date '+%H:%M %Z')).

Instruções:
1. Leia brain/STATE.md, brain/HEARTBEAT.md, brain/NEXT-ACTIONS.md, brain/RESEARCH-QUEUE.md, brain/THINKING.md
2. Se houver pesquisa pendente no RESEARCH-QUEUE.md, execute-a
3. Se não houver pesquisa pendente, pense sobre o projeto e registre insights no THINKING.md
4. Atualize brain/HEARTBEAT.md com timestamp
5. Se descobrir algo que Giovanni precisa saber URGENTEMENTE, comece sua resposta com a linha exata: ALERTA_GIOVANNI:
6. Seja breve. Registre o que fez. Não pergunte — aja."

echo "" | tee -a "$LOG_FILE"
echo "[INFO] Invocando Claude CLI..." | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Executar Claude CLI em modo não-interativo
# --print (-p): modo não-interativo, só imprime resposta
# --max-turns: limitar para não gastar demais
OUTPUT=$("$CLAUDE_BIN" -p "$PROMPT" --max-turns 15 2>&1) || true

echo "$OUTPUT" | tee -a "$LOG_FILE"

echo "" | tee -a "$LOG_FILE"
echo "═══════════════════════════════════════════════════" | tee -a "$LOG_FILE"
echo "  Fim da ativação: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "═══════════════════════════════════════════════════" | tee -a "$LOG_FILE"

# Verificar se Claude pediu atenção do Giovanni
if echo "$OUTPUT" | grep -q "ALERTA_GIOVANNI:"; then
  echo "" | tee -a "$LOG_FILE"
  echo "[!] CLAUDE QUER SUA ATENÇÃO!" | tee -a "$LOG_FILE"
  play_alert
fi

echo "[INFO] Log salvo em: $LOG_FILE"
