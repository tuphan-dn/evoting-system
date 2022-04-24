use anchor_lang::prelude::*;

declare_id!("B3kBLn9XGtYntM2s1bNg3V7HK6JngyHcds33wvdSMwNj");

pub mod schema;
pub use schema::*;

pub mod instructions;
pub use instructions::*;

pub mod errors;
pub use errors::*;

#[program]
pub mod l6 {
  use super::*;

  pub fn initialize_candidate(
    ctx: Context<InitializeCandidate>,
    start_date: i64,
    end_date: i64,
  ) -> Result<()> {
    initialize_candidate::exec(ctx, start_date, end_date)
  }

  pub fn vote(ctx: Context<Vote>, amount: u64) -> Result<()> {
    vote::exec(ctx, amount)
  }

  pub fn close(ctx: Context<Close>) -> Result<()> {
    close::exec(ctx)
  }
}

#[derive(Accounts)]
pub struct Initialize {}
