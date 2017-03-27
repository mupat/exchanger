.PHONY: all db

PROJECT = mupat/exchanger
PORT = 8080
DOCKER = docker run --rm -it

build:
	docker build -t $(PROJECT) .

run:
	$(DOCKER) -p $(PORT):$(PORT) $(PROJECT)
