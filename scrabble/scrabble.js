class Scrabble {    

    constructor(dict, points) {
      this.dictionary = dict;
      this.points = points || null;
    }
  
  /**
   * Get all words from dictionary matching the pattern, that can be created using given chars and wildcards.
   * @param {string} chars Available letters. Should include letters from pattern.
   * @param {RegExp} pattern Regular expression pattern
   * @param {number} wildcards Number of wildcard letters (blank bricks)
   * @returns {string[]} All possible words in order of dictionary
   */
    getAll(chars, pattern, wildcards) {
      this.letters = chars.toLocaleLowerCase().split('').sort();
      const dict = pattern
        ? this.dictionary.filter(word => pattern.test(word))
        : this.dictionary;
      this.wildcards = wildcards || 0;
      const result = [];
      for(var word of dict){
          if(this._isValidWord(word)) {
              result.push(word);
          }
      }
      return result;
    }
  
    /**
     * Get all words ordered by value, from dictionary matching the pattern, that can be created using given chars and wildcards.
     * @param {string} chars Awailable letters. Should include letters from pattern.
     * @param {RegExp} pattern Regular expression pattern
     * @param {number} wildcards Number of wildcard letters (blank bricks)
     * @param {{key: number}[]} points Array of key/letter values eg. [A:1, B:1, C:3...]
     * @returns {{w: string, v: number}[]} Array of words with total value, ordered by most valuable 
     */
    getAllByPoints(chars, pattern, wildcards, points) {
      var result = this.getAll(chars, pattern, wildcards);
      this.points = points || this.points;
      result = this._applyPoints(result, this.points);
      return this._orderByPoints(result, this.points);
    }
  
    /**
     * @param {string[]} words 
     * @param {{key: number}[]} points Array of key/letter values eg. [A:1, B:1, C:3...]
     * @returns {{w: string, v: number}[]} Words with total value
     * @throws {SyntaxError}
     */
    _applyPoints(words, points) {
      if(!points) throw SyntaxError('Missing parameter: points');
      var result = [];
      for(var word of words) {
        result.push({
          w: word, 
          v: this.getWordValue(word, points)
        });
      };
      return result;
    }
  
    /**
     * @param {string} word 
     * @param {{key: number}[]} points Array of key/letter values eg. [A:1, B:1, C:3...]
     * @returns {number} Sum of each letter value of word
     */
    getWordValue(word, points) {
      let chars = this.letters.join('');
      let wildcards = this.wildcards
      return word.split('')
        .reduce((sum, char) => {
          if(chars.indexOf(char) >= 0) {
            chars.replace(new RegExp(char),'');
            return sum + points[char.toLocaleUpperCase()];
          } else {
            if(--wildcards < 0) throw Error('Invalid word, not enough letters or wildcards.');
            return sum;
          }        
        }, 0);
    }
  
    /**
     * @param {{w: string, v: number}[]} words Words with value
     * @returns {{w: string, v: number}[]} Words with value, ordered by highest value
     * @throws {TypeError}
     */
    _orderByPoints(words) {
      if(! words || !words.length) return [];
      if(typeof words[0] !== 'object' || typeof words[0].v !== 'number' || words[0].v === NaN) {
        console.error(words[0]);
        throw TypeError('Invalid type, try applyPoints');
      }
      
        return words.sort((a, b) => b.v - a.v); 
    }
    
    /**
     * 
     * @param {string} word
     * @returns {bool} true if word can be made up from given letters and wildcards
     */
     _isValidWord(word) {
      const sorted = word.split('').sort();
      var index = 0;
      var wildcards = this.wildcards;
      for(var c of sorted) {
          index = this.letters.indexOf(c, index) + 1;
          if(index === 0 && wildcards-- < 1) {
              return false;
          }
      }
      return true;
    }
  
  }
  