nohup gunicorn -w 1 -b 0.0.0.0:10090 main:app >/dev/null 2>&1 &
