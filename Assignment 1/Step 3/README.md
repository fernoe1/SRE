docker build -t stepthree:v1 .

docker run -d -p 127.0.0.1:3456:80 stepthree:v1