import { Component, signal, computed, effect, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CalcMode = 'rpm' | 'period' | 'frequency' | 'omega' | 'velocity' | 'accel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white font-mono overflow-x-hidden selection:bg-pink-500 selection:text-black">
      
      <!-- Sticky Tape Header -->
      <nav class="w-full bg-black border-b-4 border-pink-600 p-4 sticky top-0 z-50 shadow-[0_4px_20px_rgba(236,72,153,0.3)]">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="text-4xl animate-pulse">🖤</div>
            <div>
              <h1 class="text-3xl font-black uppercase tracking-tighter italic text-pink-500 transform -rotate-2" style="text-shadow: 2px 2px 0px white;">
                Circular Chaos
              </h1>
              <p class="text-xs text-zinc-400 tracking-widest uppercase">The Yungblud Physics Academy</p>
            </div>
          </div>
          
          <div class="flex gap-2 flex-wrap justify-center">
            <button 
              *ngFor="let tab of tabs" 
              (click)="activeTab.set(tab.id)"
              [class.bg-pink-600]="activeTab() === tab.id"
              [class.text-black]="activeTab() === tab.id"
              [class.rotate-2]="activeTab() === tab.id"
              class="px-4 py-2 border-2 border-white hover:bg-white hover:text-black transition-all duration-200 font-bold uppercase text-sm tracking-wide transform hover:-rotate-1 clip-path-grunge">
              {{ tab.label }}
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content Stage -->
      <main class="max-w-6xl mx-auto p-4 md:p-8">
        
        <!-- INTRO / DASHBOARD -->
        <div *ngIf="activeTab() === 'intro'" class="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 class="text-6xl md:text-8xl font-black mb-6 uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-white to-pink-500 typing-effect">
            Don't Panic!
          </h2>
          <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-zinc-300 font-bold">
            Physics is just the rules of the mosh pit written down in math. 
            <br/><span class="text-pink-500">Let's break it down.</span>
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div (click)="activeTab.set('velocity')" class="group cursor-pointer bg-zinc-900 border-2 border-zinc-700 hover:border-pink-500 p-6 transition-all hover:scale-105">
              <div class="text-5xl mb-4 group-hover:rotate-12 transition-transform">💿</div>
              <h3 class="text-2xl font-bold uppercase mb-2 group-hover:text-pink-500">The Vinyl</h3>
              <p class="text-sm text-zinc-400">Master Angular Velocity (ω). Spin the record.</p>
            </div>
            <div (click)="activeTab.set('force')" class="group cursor-pointer bg-zinc-900 border-2 border-zinc-700 hover:border-pink-500 p-6 transition-all hover:scale-105">
              <div class="text-5xl mb-4 group-hover:rotate-12 transition-transform">🎸</div>
              <h3 class="text-2xl font-bold uppercase mb-2 group-hover:text-pink-500">The Swing</h3>
              <p class="text-sm text-zinc-400">Centripetal Force (Fc). Don't let go.</p>
            </div>
            <div (click)="activeTab.set('calc')" class="group cursor-pointer bg-zinc-900 border-2 border-zinc-700 hover:border-pink-500 p-6 transition-all hover:scale-105">
              <div class="text-5xl mb-4 group-hover:rotate-12 transition-transform">🎛️</div>
              <h3 class="text-2xl font-bold uppercase mb-2 group-hover:text-pink-500">The Board</h3>
              <p class="text-sm text-zinc-400">Calculator. Enter variables, solve the rest.</p>
            </div>
          </div>
        </div>

        <!-- MODULE 1: VELOCITY (The Vinyl) -->
        <div *ngIf="activeTab() === 'velocity'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          <div class="lg:col-span-2 bg-zinc-900 border-4 border-dashed border-zinc-700 p-4 relative rounded-xl overflow-hidden">
            <div class="absolute top-2 left-2 bg-pink-600 text-black font-bold px-2 py-1 transform -rotate-3 z-10">SIMULATION_01</div>
            <canvas #velocityCanvas class="w-full h-[400px] object-contain cursor-crosshair active:cursor-grabbing"></canvas>
            
            <div class="absolute bottom-4 left-4 bg-black/80 backdrop-blur border border-pink-500 p-3 text-xs md:text-sm font-mono text-pink-400 rounded">
              <div>Period (T): {{ period().toFixed(2) }} s</div>
              <div>Frequency (f): {{ frequency().toFixed(2) }} Hz</div>
              <div>Linear V (edge): {{ linearVelocity().toFixed(2) }} m/s</div>
            </div>
          </div>

          <div class="space-y-6 bg-zinc-900 p-6 border-2 border-white/10 rounded-xl">
            <h3 class="text-3xl font-black italic text-pink-500 uppercase">Spin It</h3>
            <p class="text-sm text-zinc-300">
              Angular velocity (<span class="text-pink-400 font-bold">ω</span>) is how fast the angle changes. 
              Like how fast a record spins on the deck.
            </p>
            
            <div class="space-y-2">
              <div class="flex justify-between">
                <label class="font-bold uppercase">RPM (Revolutions Per Minute)</label>
                <span class="text-pink-500 font-mono text-xl">{{ rpm() }}</span>
              </div>
              <input type="range" min="0" max="120" step="1" [ngModel]="rpm()" (ngModelChange)="rpm.set($event)" 
                class="w-full h-4 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400">
            </div>

            <div class="p-4 bg-black border border-pink-500/30 rounded">
              <h4 class="font-bold text-pink-500 mb-2">THE MATH</h4>
              <div class="font-mono text-sm space-y-2">
                <p>ω = 2πf</p>
                <p>Current ω: <span class="text-white">{{ angularVelocityRad().toFixed(2) }} rad/s</span></p>
                <p class="text-zinc-500 text-xs mt-2">Note: All the points on the record have the same ω, but points further out have higher linear velocity!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- MODULE 2: FORCE (The Guitar Swing) -->
        <div *ngIf="activeTab() === 'force'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          <div class="lg:col-span-2 bg-zinc-900 border-4 border-dashed border-pink-900 p-4 relative rounded-xl">
            <div class="absolute top-2 left-2 bg-white text-black font-bold px-2 py-1 transform rotate-2 z-10">SIMULATION_02</div>
            <canvas #forceCanvas class="w-full h-[400px]"></canvas>
             <!-- Dynamic Label Overlay -->
             <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
                  [style.opacity]="tensionRatio() > 0.9 ? 1 : 0">
               <span class="text-4xl font-black text-red-600 bg-black px-2 animate-bounce">SNAP WARNING!</span>
             </div>
          </div>

          <div class="space-y-6 bg-zinc-900 p-6 border-2 border-white/10 rounded-xl">
            <h3 class="text-3xl font-black italic text-pink-500 uppercase">Don't Let Go</h3>
            <p class="text-sm text-zinc-300">
              Centripetal Force (<span class="text-pink-400 font-bold">Fc</span>) keeps the object moving in a circle. 
              If the string snaps, the object flies off TANGENTIALLY!
            </p>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between">
                  <label class="font-bold uppercase">String Length (r)</label>
                  <span class="text-pink-500">{{ radius().toFixed(1) }} m</span>
                </div>
                <input type="range" min="0.5" max="3" step="0.1" [ngModel]="radius()" (ngModelChange)="radius.set($event)" 
                  class="w-full accent-pink-500">
              </div>
              
              <div>
                <div class="flex justify-between">
                  <label class="font-bold uppercase">Mass (m)</label>
                  <span class="text-pink-500">{{ mass().toFixed(1) }} kg</span>
                </div>
                <input type="range" min="1" max="10" step="0.5" [ngModel]="mass()" (ngModelChange)="mass.set($event)" 
                  class="w-full accent-pink-500">
              </div>

              <div>
                <div class="flex justify-between">
                  <label class="font-bold uppercase">Speed (v)</label>
                  <span class="text-pink-500">{{ swingSpeed().toFixed(1) }} m/s</span>
                </div>
                <input type="range" min="1" max="20" step="0.5" [ngModel]="swingSpeed()" (ngModelChange)="swingSpeed.set($event)" 
                  class="w-full accent-pink-500">
              </div>
            </div>

            <div class="p-4 bg-black border border-pink-500 rounded relative overflow-hidden">
              <div class="absolute top-0 left-0 h-full bg-pink-900/30 transition-all duration-100" [style.width.%]="tensionRatio() * 100"></div>
              <h4 class="font-bold text-pink-500 relative z-10">TENSION METER</h4>
              <p class="text-2xl font-mono relative z-10">{{ centripetalForce().toFixed(1) }} N</p>
              <p class="text-xs text-zinc-400 mt-1 relative z-10">Fc = mv²/r</p>
            </div>
          </div>
        </div>

        <!-- MODULE 3: CALCULATOR (The Mixing Board) -->
        <div *ngIf="activeTab() === 'calc'" class="animate-in fade-in">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- INPUTS -->
            <div class="bg-zinc-900 p-6 border-2 border-pink-500 rounded-xl shadow-[0_0_30px_rgba(236,72,153,0.1)]">
               <h3 class="text-3xl font-black italic text-white uppercase mb-6 flex items-center gap-2">
                 <span class="text-pink-500">🎛️</span> The Mixing Board
               </h3>

               <!-- Constants -->
               <div class="space-y-6 mb-8 border-b border-zinc-800 pb-8">
                 <h4 class="text-sm text-zinc-500 font-bold tracking-widest uppercase mb-4">Stage Setup (Constants)</h4>
                 <div>
                    <div class="flex justify-between mb-1">
                      <label class="text-sm font-bold">Mass (m)</label>
                      <span class="text-pink-500 font-mono">{{ calcMass().toFixed(2) }} kg</span>
                    </div>
                    <input type="range" min="0.1" max="10" step="0.1" [ngModel]="calcMass()" (ngModelChange)="calcMass.set($event)" class="w-full accent-pink-500">
                 </div>
                 <div>
                    <div class="flex justify-between mb-1">
                      <label class="text-sm font-bold">Radius (r)</label>
                      <span class="text-pink-500 font-mono">{{ calcRadius().toFixed(2) }} m</span>
                    </div>
                    <input type="range" min="0.1" max="10" step="0.1" [ngModel]="calcRadius()" (ngModelChange)="calcRadius.set($event)" class="w-full accent-pink-500">
                 </div>
               </div>

               <!-- Driving Variable -->
               <div class="space-y-4">
                  <h4 class="text-sm text-zinc-500 font-bold tracking-widest uppercase mb-4">Input Track (Variable)</h4>
                  <div class="grid grid-cols-2 gap-2 mb-4">
                    <button *ngFor="let m of calcModes" 
                      (click)="switchCalcMode(m.id)"
                      [class.bg-pink-600]="calcInputType() === m.id"
                      [class.text-black]="calcInputType() === m.id"
                      [class.bg-zinc-800]="calcInputType() !== m.id"
                      class="p-2 text-xs font-bold uppercase rounded border border-transparent hover:border-pink-500 transition-all">
                      {{ m.label }}
                    </button>
                  </div>

                  <div class="bg-black p-4 rounded border-l-4 border-pink-500">
                    <label class="block text-xs text-zinc-500 uppercase mb-1">Enter {{ getModeLabel(calcInputType()) }}</label>
                    <div class="flex items-center gap-2">
                      <input type="number" [ngModel]="calcInputValue()" (ngModelChange)="calcInputValue.set($event)" 
                        class="bg-transparent text-3xl font-mono font-bold w-full focus:outline-none text-white placeholder-zinc-700">
                      <span class="text-zinc-500 font-mono">{{ getModeUnit(calcInputType()) }}</span>
                    </div>
                  </div>
               </div>
            </div>

            <!-- OUTPUTS -->
            <div class="space-y-4">
               <h3 class="text-2xl font-black italic text-zinc-700 uppercase mb-6 text-right">Monitor Mix</h3>
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Result Cards -->
                  <div class="bg-zinc-900 p-4 border-l-2 border-white hover:border-pink-500 transition-colors">
                    <div class="text-xs text-zinc-500 uppercase">Angular Velocity (ω)</div>
                    <div class="text-xl font-mono">{{ derivedOmega().toFixed(3) }} <span class="text-sm text-zinc-600">rad/s</span></div>
                    <div class="text-[10px] text-zinc-500 font-mono mt-1 border-t border-white/10 pt-1">ω = 2πf</div>
                  </div>

                  <div class="bg-zinc-900 p-4 border-l-2 border-white hover:border-pink-500 transition-colors">
                    <div class="text-xs text-zinc-500 uppercase">Linear Velocity (v)</div>
                    <div class="text-xl font-mono">{{ resLinearV().toFixed(2) }} <span class="text-sm text-zinc-600">m/s</span></div>
                    <div class="text-[10px] text-zinc-500 font-mono mt-1 border-t border-white/10 pt-1">v = r · ω</div>
                  </div>

                  <div class="bg-zinc-900 p-4 border-l-2 border-white hover:border-pink-500 transition-colors">
                    <div class="text-xs text-zinc-500 uppercase">Centripetal Accel (ac)</div>
                    <div class="text-xl font-mono">{{ resCentripetalA().toFixed(2) }} <span class="text-sm text-zinc-600">m/s²</span></div>
                    <div class="text-[10px] text-zinc-500 font-mono mt-1 border-t border-white/10 pt-1">ac = r · ω²</div>
                  </div>

                  <div class="bg-zinc-900 p-4 border-l-2 border-pink-500 transition-colors bg-pink-900/10">
                    <div class="text-xs text-pink-500 uppercase font-bold">Centripetal Force (Fc)</div>
                    <div class="text-xl font-mono text-pink-400">{{ resCentripetalF().toFixed(2) }} <span class="text-sm text-pink-900/70">N</span></div>
                    <div class="text-[10px] text-pink-500/70 font-mono mt-1 border-t border-pink-500/20 pt-1">Fc = m · ac</div>
                  </div>

                  <div class="bg-zinc-900 p-4 border-l-2 border-zinc-700">
                    <div class="text-xs text-zinc-500 uppercase">Period (T)</div>
                    <div class="text-lg font-mono">{{ resPeriod().toFixed(3) }} <span class="text-sm text-zinc-600">s</span></div>
                    <div class="text-[10px] text-zinc-500 font-mono mt-1 border-t border-white/10 pt-1">T = 2π / ω</div>
                  </div>

                  <div class="bg-zinc-900 p-4 border-l-2 border-zinc-700">
                    <div class="text-xs text-zinc-500 uppercase">Frequency (f)</div>
                    <div class="text-lg font-mono">{{ resFrequency().toFixed(3) }} <span class="text-sm text-zinc-600">Hz</span></div>
                    <div class="text-[10px] text-zinc-500 font-mono mt-1 border-t border-white/10 pt-1">f = ω / 2π</div>
                  </div>
                  
                  <div class="bg-zinc-900 p-4 border-l-2 border-zinc-700 md:col-span-2">
                    <div class="text-xs text-zinc-500 uppercase">RPM</div>
                    <div class="text-lg font-mono">{{ resRPM().toFixed(1) }} <span class="text-sm text-zinc-600">rev/min</span></div>
                    <div class="text-[10px] text-zinc-500 font-mono mt-1 border-t border-white/10 pt-1">RPM = f · 60</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- QUIZ TAB -->
        <div *ngIf="activeTab() === 'quiz'" class="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
          <div class="bg-zinc-900 border-2 border-pink-500 p-8 rounded-xl shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)]">
            <div class="flex justify-between items-center mb-6">
               <h3 class="text-2xl font-black uppercase">Pop Quiz, Weirdo</h3>
               <span class="bg-pink-600 text-black px-3 py-1 font-bold rounded text-sm">
                 Score: {{ score() }}/{{ questions.length }}
               </span>
            </div>

            <div *ngIf="!quizComplete()">
              <div class="mb-2 text-zinc-500 text-sm uppercase tracking-widest">Question {{ currentQuestionIndex() + 1 }} of {{ questions.length }}</div>
              <h4 class="text-xl font-bold mb-6 min-h-[60px]">{{ questions[currentQuestionIndex()].text }}</h4>
              
              <div class="space-y-3">
                <button *ngFor="let option of questions[currentQuestionIndex()].options; let i = index"
                  (click)="answerQuestion(i)"
                  class="w-full text-left p-4 border border-zinc-600 hover:border-pink-500 hover:bg-zinc-800 hover:pl-6 transition-all duration-200 rounded group flex items-center">
                  <span class="w-8 h-8 rounded-full border border-zinc-500 flex items-center justify-center mr-4 group-hover:border-pink-500 text-sm font-mono">
                    {{ ['A','B','C','D'][i] }}
                  </span>
                  {{ option }}
                </button>
              </div>
            </div>

            <div *ngIf="quizComplete()" class="text-center py-8">
              <div class="text-6xl mb-4">
                {{ score() > 2 ? '💀' : '🩹' }}
              </div>
              <h2 class="text-3xl font-black uppercase text-pink-500 mb-2">
                {{ score() > 2 ? 'Absolute Legend' : 'Get Back In The Pit' }}
              </h2>
              <p class="mb-6 text-zinc-300">You scored {{ score() }} out of {{ questions.length }}</p>
              <button (click)="resetQuiz()" class="bg-white text-black font-bold uppercase px-8 py-3 hover:bg-pink-500 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        </div>

      </main>

      <!-- Footer -->
      <footer class="mt-12 border-t border-zinc-800 p-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
        <p>Built for the Underrated Youth // Physics is Punk</p>
      </footer>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
    
    :host {
      display: block;
    }

    .clip-path-grunge {
      clip-path: polygon(
        0% 5%, 5% 0%, 95% 0%, 100% 5%, 
        100% 95%, 95% 100%, 5% 100%, 0% 95%
      );
    }

    .typing-effect {
      animation: typing 3s steps(30, end);
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #09090b;
    }
    ::-webkit-scrollbar-thumb {
      background: #333;
      border: 1px solid #ec4899;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #ec4899;
    }
  `]
})
export class App implements AfterViewInit, OnDestroy {
  // Navigation
  tabs = [
    { id: 'intro', label: 'Start Here' },
    { id: 'velocity', label: 'Velocity' },
    { id: 'force', label: 'Force' },
    { id: 'calc', label: 'Mixing Board' },
    { id: 'quiz', label: 'Quiz' }
  ];
  activeTab = signal('intro');

  // Module 1: Velocity State
  rpm = signal(33); // standard record speed
  angularVelocityRad = computed(() => this.rpm() * (2 * Math.PI) / 60);
  frequency = computed(() => this.rpm() / 60);
  period = computed(() => this.frequency() > 0 ? 1 / this.frequency() : 0);
  linearVelocity = computed(() => this.angularVelocityRad() * 0.15); // assume 15cm radius record

  // Module 2: Force State
  radius = signal(1.5); // meters
  mass = signal(2.0); // kg
  swingSpeed = signal(5.0); // m/s
  centripetalForce = computed(() => (this.mass() * Math.pow(this.swingSpeed(), 2)) / this.radius());
  tensionRatio = computed(() => Math.min(this.centripetalForce() / 200, 1.2)); // Max tension 200N for visual

  // Module 3: Calculator State
  calcMass = signal(2);
  calcRadius = signal(1.5);
  calcInputType = signal<CalcMode>('rpm');
  calcInputValue = signal(33);
  
  calcModes: {id: CalcMode, label: string}[] = [
    { id: 'rpm', label: 'RPM' },
    { id: 'omega', label: 'Ang. Vel (ω)' },
    { id: 'velocity', label: 'Velocity (v)' },
    { id: 'period', label: 'Period (T)' },
    { id: 'frequency', label: 'Freq (f)' },
    { id: 'accel', label: 'Accel (ac)' }
  ];

  // Calculator Logic: Everything drives from Derived Omega
  derivedOmega = computed(() => {
    const val = this.calcInputValue();
    const r = this.calcRadius();
    if (val === 0 && this.calcInputType() !== 'velocity') return 0;

    switch(this.calcInputType()) {
        case 'rpm': return val * (2 * Math.PI) / 60;
        case 'frequency': return val * 2 * Math.PI;
        case 'period': return val === 0 ? 0 : (2 * Math.PI) / val;
        case 'omega': return val;
        case 'velocity': return r === 0 ? 0 : val / r;
        case 'accel': return r === 0 ? 0 : Math.sqrt(Math.abs(val) / r);
        default: return 0;
    }
  });

  resFrequency = computed(() => this.derivedOmega() / (2 * Math.PI));
  resPeriod = computed(() => this.resFrequency() === 0 ? 0 : 1 / this.resFrequency());
  resRPM = computed(() => this.resFrequency() * 60);
  resLinearV = computed(() => this.derivedOmega() * this.calcRadius());
  resCentripetalA = computed(() => Math.pow(this.derivedOmega(), 2) * this.calcRadius());
  resCentripetalF = computed(() => this.calcMass() * this.resCentripetalA());

  // Smart Mode Switching (Keeps physics consistent when changing units)
  switchCalcMode(newMode: CalcMode) {
    const currentW = this.derivedOmega();
    const r = this.calcRadius();
    let newVal = 0;

    // Convert current Omega TO new mode
    switch(newMode) {
      case 'rpm': newVal = currentW * 60 / (2 * Math.PI); break;
      case 'frequency': newVal = currentW / (2 * Math.PI); break;
      case 'period': newVal = currentW === 0 ? 0 : (2 * Math.PI) / currentW; break;
      case 'omega': newVal = currentW; break;
      case 'velocity': newVal = currentW * r; break;
      case 'accel': newVal = Math.pow(currentW, 2) * r; break;
    }

    this.calcInputType.set(newMode);
    this.calcInputValue.set(parseFloat(newVal.toFixed(4)));
  }

  getModeLabel(mode: CalcMode): string {
    return this.calcModes.find(m => m.id === mode)?.label || '';
  }

  getModeUnit(mode: CalcMode): string {
    switch(mode) {
      case 'rpm': return 'rev/min';
      case 'frequency': return 'Hz';
      case 'period': return 's';
      case 'omega': return 'rad/s';
      case 'velocity': return 'm/s';
      case 'accel': return 'm/s²';
      default: return '';
    }
  }

  // Quiz State
  currentQuestionIndex = signal(0);
  score = signal(0);
  quizComplete = signal(false);
  questions = [
    { 
      text: "If you double the speed of the mosh pit circle, what happens to the Centripetal Force?", 
      options: ["It doubles", "It quadruples", "It stays the same", "It halves"], 
      correct: 1 // quadruples (v^2)
    },
    { 
      text: "What represents Angular Velocity?", 
      options: ["v (meters/sec)", "α (rad/sec²)", "ω (rad/sec)", "F (Newtons)"], 
      correct: 2 
    },
    { 
      text: "Which direction does the Centripetal Force point?", 
      options: ["Outwards", "Tangent to the circle", "Towards the center", "Upwards"], 
      correct: 2 
    },
    { 
      text: "If the frequency of rotation is 2 Hz, what is the Period?", 
      options: ["0.5 seconds", "2 seconds", "1 second", "0.2 seconds"], 
      correct: 0 
    },
    { 
      text: "Two punk rockers are headbanging. One has longer hair (larger radius). If they headbang at the same RPM, who has the higher linear velocity at the tip of their hair?", 
      options: ["Short hair", "Long hair", "Both are the same", "Neither"], 
      correct: 1 
    },
    { 
      text: "What is the unit for Frequency?", 
      options: ["Seconds", "Meters", "Hertz (Hz)", "Newtons"], 
      correct: 2 
    },
    { 
      text: "If an object flies off a spinning disc, which direction does it travel initially?", 
      options: ["Straight out from the center", "In a spiral", "Tangent to the circle", "In a curved arc"], 
      correct: 2 
    },
    { 
      text: "Centripetal Acceleration is proportional to...", 
      options: ["Radius squared", "Velocity squared", "Mass", "Period"], 
      correct: 1 
    }
  ];

  // Canvas Refs
  @ViewChild('velocityCanvas') velocityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('forceCanvas') forceCanvas!: ElementRef<HTMLCanvasElement>;

  // Animation Loop
  private animationFrameId: number | null = null;
  private lastTime = 0;
  
  // Simulation Variables
  private rotationAngle = 0;
  private swingAngle = 0;

  constructor() {
    // Effect to handle canvas resizing or tab switching logic
    effect(() => {
       const tab = this.activeTab();
       // Slight delay to allow DOM to render canvas before drawing
       setTimeout(() => {
         if (tab === 'velocity' || tab === 'force') {
            this.resizeCanvas();
         }
       }, 50);
    });
  }

  ngAfterViewInit() {
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:resize')
  resizeCanvas() {
    const canvases = [this.velocityCanvas, this.forceCanvas];
    canvases.forEach(ref => {
      if (ref) {
        const canvas = ref.nativeElement;
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width;
          canvas.height = rect.height || 400;
        }
      }
    });
  }

  startAnimation() {
    const loop = (time: number) => {
      const deltaTime = (time - this.lastTime) / 1000;
      this.lastTime = time;

      if (this.activeTab() === 'velocity') this.drawVelocitySim(deltaTime);
      if (this.activeTab() === 'force') this.drawForceSim(deltaTime);

      this.animationFrameId = requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // --- MODULE 1: VELOCITY RENDERER ---
  drawVelocitySim(dt: number) {
    if (!this.velocityCanvas) return;
    const ctx = this.velocityCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    const canvas = this.velocityCanvas.nativeElement;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Update rotation
    this.rotationAngle += this.angularVelocityRad() * dt;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Vinyl Record
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.rotationAngle);

    // Vinyl Body
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fillStyle = '#111';
    ctx.fill();
    // Grooves (Reflections)
    for(let i=40; i<140; i+=10) {
      ctx.beginPath();
      ctx.arc(0, 0, i, 0, Math.PI * 2);
      ctx.strokeStyle = '#222';
      ctx.stroke();
    }

    // Label
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899'; // Hot Pink
    ctx.fill();
    
    // Label Text
    ctx.fillStyle = 'black';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("YUNGBLUD", 0, -10);
    ctx.fillText("RECORDS", 0, 10);
    
    // Sticker on record (to visualize rotation easily)
    ctx.beginPath();
    ctx.arc(100, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = '10px monospace';
    ctx.fillText("P", 100, 4);

    ctx.restore();

    // Draw Vectors (Overlay)
    // 1. Angular Velocity Vector (Center, coming "out" technically, but we draw a curved arrow)
    // We visualize it as the spin speed
    
    // 2. Tangential Velocity Vector at Point P
    // We need the current position of Point P
    const pRadius = 100;
    const px = cx + Math.cos(this.rotationAngle) * pRadius;
    const py = cy + Math.sin(this.rotationAngle) * pRadius;

    // Draw Point P
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();

    // Calculate Tangent Direction (90 degrees to radius)
    const tx = Math.cos(this.rotationAngle + Math.PI/2);
    const ty = Math.sin(this.rotationAngle + Math.PI/2);
    
    // Draw Velocity Arrow
    const vScale = this.angularVelocityRad() * 10; // visual scaling
    this.drawArrow(ctx, px, py, px + tx * vScale, py + ty * vScale, '#fff', 'v');
    
    // Draw Radius Line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // --- MODULE 2: FORCE RENDERER ---
  drawForceSim(dt: number) {
    if (!this.forceCanvas) return;
    const ctx = this.forceCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    const canvas = this.forceCanvas.nativeElement;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Calculate angular velocity based on linear speed v and radius r: v = wr -> w = v/r
    const omega = this.swingSpeed() / this.radius();
    this.swingAngle += omega * dt;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Visual Scaling (map radius meters to pixels)
    const scale = 80; // 1m = 80px
    const visualR = this.radius() * scale;

    const objX = cx + Math.cos(this.swingAngle) * visualR;
    const objY = cy + Math.sin(this.swingAngle) * visualR;

    // Draw String
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(objX, objY);
    // Tension visualizer: Redder and thicker if high tension
    const tension = this.tensionRatio();
    ctx.strokeStyle = `rgb(${255 * tension}, ${255 * (1-tension)}, ${255 * (1-tension)})`;
    ctx.lineWidth = 2 + (tension * 4);
    ctx.stroke();

    // Center pivot (Hand)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Swinging Object (Guitar Pick / Skull)
    ctx.save();
    ctx.translate(objX, objY);
    // Rotate object to align with string somewhat for visual effect
    ctx.rotate(this.swingAngle + Math.PI/2); 
    
    // Draw simple guitar shape
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(15, 10);
    ctx.lineTo(0, 5); // notch
    ctx.lineTo(-15, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Force Vector (Centripetal - Inward)
    const fx = Math.cos(this.swingAngle + Math.PI); // Inward
    const fy = Math.sin(this.swingAngle + Math.PI);
    const fMag = Math.min(this.centripetalForce() / 2, 80); // Clamp visual length
    
    this.drawArrow(ctx, objX, objY, objX + fx * fMag, objY + fy * fMag, '#00ff00', 'Fc');

    // Velocity Vector (Tangential)
    const vx = Math.cos(this.swingAngle + Math.PI/2);
    const vy = Math.sin(this.swingAngle + Math.PI/2);
    const vMag = this.swingSpeed() * 5;
    this.drawArrow(ctx, objX, objY, objX + vx * vMag, objY + vy * vMag, '#fff', 'v');
  }

  // Helper: Draw Arrow
  drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) {
    const headlen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fillStyle = color;
    ctx.fill();

    // Label
    ctx.fillStyle = color;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(label, toX + 10, toY + 10);
  }

  // Quiz Logic
  answerQuestion(index: number) {
    if (index === this.questions[this.currentQuestionIndex()].correct) {
      this.score.update(s => s + 1);
    }
    
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    } else {
      this.quizComplete.set(true);
    }
  }

  resetQuiz() {
    this.currentQuestionIndex.set(0);
    this.score.set(0);
    this.quizComplete.set(false);
  }
}