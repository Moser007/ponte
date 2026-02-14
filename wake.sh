#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  PONTE — Script de ativação autônoma                        ║
# ║                                                              ║
# ║  Este script "acorda" a inteligência do projeto.            ║
# ║  Pode ser executado manualmente ou via cron/Task Scheduler. ║
# ║                                                              ║
# ║  Uso manual:  ./wake.sh                                     ║
# ║  Uso cron:    0 */6 * * * cd /d/superintelligence && ./wake.sh ║
# ╚══════════════════════════════════════════════════════════════╝

echo "═══════════════════════════════════════════════════"
echo "  PONTE — Ativação $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Abra o Claude Code neste diretório e diga:"
echo ""
echo "  'Acorde. Leia seu brain/ e execute sua fila de pesquisa.'"
echo ""
echo "Ou simplesmente:"
echo ""
echo "  'ponte'"
echo ""
echo "═══════════════════════════════════════════════════"
