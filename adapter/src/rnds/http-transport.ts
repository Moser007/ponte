import * as https from 'node:https';
import * as http from 'node:http';

/**
 * Resposta HTTP simplificada.
 */
export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Opções para uma requisição HTTP.
 */
export interface HttpRequestOptions {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  /** Certificado PFX para mTLS (Buffer do arquivo .pfx) */
  pfx?: Buffer;
  /** Senha do certificado PFX */
  passphrase?: string;
}

/**
 * Interface de transporte HTTP — permite injeção para testes.
 */
export interface HttpTransport {
  request(options: HttpRequestOptions): Promise<HttpResponse>;
}

/**
 * Implementação real usando Node.js https module.
 * Suporta mTLS com certificado PFX (ICP-Brasil).
 */
export class NodeHttpTransport implements HttpTransport {
  async request(options: HttpRequestOptions): Promise<HttpResponse> {
    const url = new URL(options.url);

    const requestOptions: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: options.method,
      headers: {
        ...options.headers,
      },
    };

    // Configurar mTLS se certificado fornecido
    if (options.pfx) {
      requestOptions.pfx = options.pfx;
      requestOptions.passphrase = options.passphrase;
      requestOptions.rejectUnauthorized = true;
    }

    return new Promise<HttpResponse>((resolve, reject) => {
      const req = https.request(requestOptions, (res: http.IncomingMessage) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk: Buffer) => chunks.push(chunk));

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf-8');
          const headers: Record<string, string> = {};
          for (const [key, value] of Object.entries(res.headers)) {
            if (typeof value === 'string') {
              headers[key] = value;
            } else if (Array.isArray(value)) {
              headers[key] = value[0];
            }
          }

          resolve({
            status: res.statusCode ?? 0,
            headers,
            body,
          });
        });
      });

      req.on('error', reject);

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }
}
