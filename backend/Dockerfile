FROM python:3.11-slim

WORKDIR /app

# Install wait-for-it script
RUN apt-get update && apt-get install -y wget && \
    wget -O /usr/sbin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/sbin/wait-for-it.sh

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["/bin/bash", "-c", "wait-for-it.sh db:5432 -- uvicorn main:app --host 0.0.0.0 --port 5000 --reload"] 