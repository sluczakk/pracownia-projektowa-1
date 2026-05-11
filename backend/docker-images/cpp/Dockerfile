FROM gcc:13

WORKDIR /app

RUN useradd -m runner
USER runner

#CMD ["sh", "-c", "g++ main.cpp -O2 -o main && ./main"]
CMD ["sh", "-c", "g++ main.cpp -O2 -o /tmp/main && /tmp/main"]