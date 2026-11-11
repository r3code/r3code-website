---
title: 'Укрощение хаоса логов с помощью модели OpenTelemetry, Vector и ClickHouse. Итоги за два года'
venue: 'DevOpsConf 2025'
year: 2025
type: talk
date: '2025-04-08'
venueUrl: 'https://devopsconf.io/moscow/2025/abstracts/14184'
rating:
  content: 4.80
  delivery: 4.82
role: speaker
abstract: 'https://devopsconf.io/moscow/2025/abstracts/14184'
videos:
  - { platform: YouTube, url: 'https://youtu.be/cp0HVptu6tU' }
  - { platform: RuTube, url: 'https://rutube.ru/video/private/db14cd9d1a7113271de7446abd112cd7/?p=m_LEe-HSmKHkn52EcrWApA' }
  - { platform: 'VK Видео', url: 'https://vkvideo.ru/video-163333847_456239934?list=ln-Zu57y3zqrzJjmSTHjn' }
featured: true
teaser: 'Двухлетний опыт миграции с EFK на открытый стек Vector + OpenTelemetry + ClickHouse: что работает, что ломается, какие экономические итоги.'
subtitle: 'OpenTelemetry + Vector + ClickHouse'
---

## О докладе

Доклад об итогах двух лет эксплуатации стека логирования на основе **OpenTelemetry, Vector и ClickHouse**. Рассматривается миграция с EFK, разделение логов по явному TTL, post-анализ бизнес-ошибок через Vector remap.

Внутри:

- Исходное состояние инфраструктуры логирования и почему пришлось мигрировать
- Архитектура целевого решения: агент/daemonset + Kafka + ClickStack
- Разделение логов по явному TTL (`TTL_overridden=true/false`)
- Кейс: аудит бизнес-ошибок через Vector remap + ClickHouse
- Экономические итоги за 2 года: снижение расходов в 3–5 раз
- Подводные камни миграции и чего стоит избегать

## Оценки

- **Содержание:** 4.80 / 5
- **Подача:** 4.82 / 5

## Материалы

Запись доклада доступна на трёх платформах — YouTube, RuTube и VK Видео. На странице конференции также доступно описание и обсуждение.
