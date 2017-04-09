#!/usr/bin/env bash
/home/hsablonniere/apps/WebStorm/bin/webstorm.sh /home/hsablonniere/dev/tia-multiscreen-demos/01-window-open &
sleep 12
/home/hsablonniere/apps/WebStorm/bin/webstorm.sh /home/hsablonniere/dev/tia-multiscreen-demos/02-localstorage-event &
sleep 3
/home/hsablonniere/apps/WebStorm/bin/webstorm.sh /home/hsablonniere/dev/tia-multiscreen-demos/03-shared-worker &
sleep 3
/home/hsablonniere/apps/WebStorm/bin/webstorm.sh /home/hsablonniere/dev/tia-multiscreen-demos/04-service-worker &
sleep 3
/home/hsablonniere/apps/WebStorm/bin/webstorm.sh /home/hsablonniere/dev/tia-multiscreen-demos/05-broadcast-channel &
sleep 5

wmctrl -r "demos/01-window-open] - " -t 0
wmctrl -r "demos/02-localstorage-event] - " -t 1
wmctrl -r "demos/03-shared-worker] - " -t 2
wmctrl -r "demos/04-service-worker] - " -t 3
wmctrl -r "demos/05-broadcast-channel] - " -t 4

google-chrome --new-window --force-device-scale-factor=1 --profile-directory='Profile 2' http://localhost:3000/01-window-open &
sleep 3
google-chrome --new-window --force-device-scale-factor=1 --profile-directory='Profile 2' http://localhost:3000/02-localstorage-event &
sleep 3
google-chrome --new-window --force-device-scale-factor=1 --profile-directory='Profile 2' http://localhost:3000/03-shared-worker &
sleep 3
google-chrome --new-window --force-device-scale-factor=1 --profile-directory='Profile 2' http://localhost:3000/04-service-worker &
sleep 3
google-chrome --new-window --force-device-scale-factor=1 --profile-directory='Profile 2' http://localhost:3000/05-broadcast-channel &
sleep 3

wmctrl -r "01-window-open - Google Chrome" -t 0
wmctrl -r "02-localstorage-event - Google Chrome" -t 1
wmctrl -r "03-shared-worker - Google Chrome" -t 2
wmctrl -r "04-service-worker - Google Chrome" -t 3
wmctrl -r "05-broadcast-channel - Google Chrome" -t 4
