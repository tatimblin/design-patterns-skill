class Lights {
  on() { console.log("[Lights] Turned on"); }
  off() { console.log("[Lights] Turned off"); }
  dim(level: number) { console.log(`[Lights] Dimmed to ${level}%`); }
}

class Thermostat {
  set(temp: number) { console.log(`[Thermostat] Set to ${temp}°F`); }
}

class SecuritySystem {
  arm() { console.log("[Security] Armed"); }
  disarm() { console.log("[Security] Disarmed"); }
}

class MusicPlayer {
  play(genre: string) { console.log(`[Music] Playing ${genre}`); }
  stop() { console.log("[Music] Stopped"); }
}

class SmartHome {
  private lights = new Lights();
  private thermostat = new Thermostat();
  private security = new SecuritySystem();
  private music = new MusicPlayer();

  goodMorning() {
    console.log("--- Good Morning ---");
    this.security.disarm();
    this.lights.on();
    this.thermostat.set(72);
    this.music.play("jazz");
  }

  goodNight() {
    console.log("--- Good Night ---");
    this.music.stop();
    this.lights.dim(10);
    this.thermostat.set(66);
    this.security.arm();
  }

  leaveHome() {
    console.log("--- Leaving Home ---");
    this.music.stop();
    this.lights.off();
    this.thermostat.set(60);
    this.security.arm();
  }
}

// --- run ---
const home = new SmartHome();
home.goodMorning();
home.goodNight();
home.leaveHome();
