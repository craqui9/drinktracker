import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DrinkCounts {
  cerveza: number;
  copa: number;
  chupito: number;
}

export interface Totals extends DrinkCounts {
  totalUsuarios: number;
}

export interface LeaderboardEntry extends DrinkCounts {
  username: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class DrinkService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Get the current user's drink counts */
  getMyDrinks(): Observable<DrinkCounts> {
    return this.http.get<DrinkCounts>(`${this.API}/drinks/my`);
  }

  /**
   * Add drinks to the current user's counters.
   * Only pass the drinks you want to increment.
   */
  addDrinks(drinks: Partial<DrinkCounts>): Observable<DrinkCounts> {
    return this.http.post<DrinkCounts>(`${this.API}/drinks/add`, drinks);
  }

  /** Reset the current user's counters to zero */
  resetMyDrinks(): Observable<DrinkCounts> {
    return this.http.post<DrinkCounts>(`${this.API}/drinks/reset`, {});
  }

  /** Get the global sum of all users' drinks */
  getTotals(): Observable<Totals> {
    return this.http.get<Totals>(`${this.API}/drinks/totals`);
  }

  /** Get leaderboard (bonus endpoint) */
  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.API}/drinks/leaderboard`);
  }
}
