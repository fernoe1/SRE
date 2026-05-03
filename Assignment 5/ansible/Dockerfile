FROM ubuntu:22.04

RUN apt update && \
    apt install -y ansible openssh-client sshpass && \
    apt clean

WORKDIR /ansible

CMD ["bash"]