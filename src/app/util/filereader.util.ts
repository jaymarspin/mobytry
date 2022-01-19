export class FileReaderA extends window.FileReader {
  constructor() {
    super();
    const zoneOriginalInstance = (this as any)['__zone_symbol__originalInstance'];
    return zoneOriginalInstance || this;
  }
}

window.FileReader = FileReaderA;
