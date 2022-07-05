import { Injectable } from '@angular/core';
import { WebServer, Request, Response } from '@awesome-cordova-plugins/web-server/ngx';

const PORT = 8080;

@Injectable({
  providedIn: 'root'
})
export class TileBufferService {

  constructor(
    private webserver: WebServer
  ) {
    this.startServer();
  }

  url(mapId: string) {
    return `http://localhost:${PORT}/${mapId}/\${z}/\${x}/\${y}`;
  }

  private startServer() {
    this.webserver.onRequest().subscribe(req => this.handleRequest(req));
    this.webserver.start(PORT).catch(err => console.log(err));
  }

  private handleRequest(req: Request) {
    const args = req.path.split('/');
    
    if(args.length < 5) {
      this.send404(req);
      return;
    }
    
    const [, mapId, zoom, x, y] = args;

    const tile = this.loadTile(mapId, zoom, x, y);

    this.webserver.sendResponse(req.requestId, <Response>{
      status: 200,
      body: tile,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  }

  private loadTile(mapId: string, zoom: string, x: string, y: string): string {
    // check if map exists
    // yes:
    // - okidoki
    // no:
    // - return empty tile

    // check if tile is stored locally
    // yes:
    // - load and return
    // no:
    // - load from server
    // - store locally
    // - return

    return '';
  }

  private send404(req: Request) {
    this.webserver.sendResponse(req.requestId, <Response>{
      status: 404,
      body: 'Not Found',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}